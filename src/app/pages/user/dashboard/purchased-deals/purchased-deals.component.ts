import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-purchased-deals',
  templateUrl: './purchased-deals.component.html',
  styles: []
})
export class PurchasedDealsComponent implements OnInit {
  private userSub: Subscription;

  isLoading = false; user:User; deals = []; orders = []; 
  detailsModalDisplay = 'none'; isFullRefund = false;
  toBeRefOrderId = null; toBeRefDealId = null; toBeRefDealName = null;
  toBeRefCouponAmt = 0; toBeRefRewardAmt = 0; toBeRefAmt = 0;

  constructor(private authService: AuthService, private userService:UserService,
    private router:Router, private cartService :CartService,
    private toastrService:ToastrService, private windowRefService: WindowRefService) 
  { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        // this.getDealOrders();
        this.getOrders();
      }
    });
  }

  ngOnInit(): void {
  }

  getOrders(){
    this.isLoading = true; 
    this.userService.getOrders(this.user.id).subscribe(
      res => {
        this.orders = res.data;
        this.orders.forEach(order => {
          order.createdAt = order.createdAt ? moment(order.createdAt).format('DD MMM YYYY') : null;          
          order.deals.forEach( (deal:any) => {
            let redeemDate;

            if(deal.redeemDate)
              redeemDate = deal.redeemDate;
            else{
              redeemDate = new Date();
              redeemDate.setDate(redeemDate.getDate() + 90);
            }
            if(deal.purchaseDate){
              const diffDays = this.calculateDiff(deal.purchaseDate);
              if(diffDays > 10){
                deal.isRefunded = true;
              }
            }
            deal.purchaseDate = deal.purchaseDate ? moment(deal.purchaseDate).format('DD MMM YYYY') : null;
            deal.redeemDate = moment(redeemDate).format('DD MMM YYYY');
            deal.refundDate = deal.refundDate ? moment(deal.refundDate).format('DD MMM YYYY') : null;
          });
        });
        // console.log(this.orders)
        this.isLoading = false; 
      },
        errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
      )
  }

  calculateDiff(purchaseDate){
    let date = new Date(purchaseDate);
    let currentDate = new Date();
    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }

  // getDealOrders(){
  //   this.isLoading = true; 
  //   this.userService.getDealOrders(this.user.id).subscribe(
  //     res => {
  //       this.deals = res.data;
  //       this.deals.forEach(deal => {
  //         deal.purchaseDate = deal.purchaseDate ? moment(deal.purchaseDate).format('DD MMM YYYY') : null;
  //         deal.redeemDate = deal.redeemDate ? moment(deal.redeemDate).format('DD MMM YYYY') : null;
  //         deal.refundDate = deal.refundDate ? moment(deal.refundDate).format('DD MMM YYYY') : null;
  //       });
  //       // console.log(this.deals)
  //       this.isLoading = false; 
  //     },
  //       errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
  //     )
  // }
  
  onInvoice(orderId:string){
    this.router.navigate([`/user/dashboard/invoice/${orderId}`]);
  }

  onRedeem(dealLink:string, orderId:string){
    this.router.navigate([`/user/dashboard/redeem/${dealLink}/${orderId}`]);
  }

  onProductPage(dealLink:string){
    this.router.navigate([`${environment.dealsBaseUrl}/${dealLink}`]);
  }

  onRefund(order:any, deal:any){
    const orderId = order._id;
    const dealId = deal.dealId._id;
    // console.log("orderId : ",orderId," - dealId : ",dealId);
    // console.log("order : ",order," - deal : ",deal);

    if(orderId == null || orderId == undefined || orderId == "")
      return false;

    if(dealId == null || dealId == undefined || dealId == "")
      return false;

    this.toBeRefOrderId = orderId; this.toBeRefDealId = dealId; this.toBeRefDealName = deal.dealId.dealName;

    const dealAmount = deal.amount;
    let { couponId, couponPer, rewardAmount, couponAmount, refCouponAmount, refRewardAmount } = order;    

    rewardAmount = rewardAmount ?? 0;
    couponAmount = couponAmount ?? 0; 
    refCouponAmount = refCouponAmount ?? 0; 
    refRewardAmount = refRewardAmount ?? 0;
      
    const balCouponAmt = couponAmount - refCouponAmount;
    const balRewardAmt = rewardAmount - refRewardAmount;
    
    let calDealAmount = dealAmount;
    this.toBeRefCouponAmt = 0; this.toBeRefRewardAmt = 0; this.toBeRefAmt = 0;

    if(couponId && couponPer && balCouponAmt > 0){
      this.toBeRefCouponAmt = ((+dealAmount * +couponPer) / 100 );
      calDealAmount = calDealAmount - this.toBeRefCouponAmt; 
    }

    if(balRewardAmt > 0){
      if(balRewardAmt > calDealAmount)
        this.toBeRefRewardAmt = calDealAmount;
      else
        this.toBeRefRewardAmt = balRewardAmt;
      calDealAmount = calDealAmount - this.toBeRefRewardAmt;
    }

    if(calDealAmount > 0){
      this.toBeRefAmt = calDealAmount;
    }
    
    // console.log("toBeRefCouponAmt : ",this.toBeRefCouponAmt," - toBeRefRewardAmt : ",this.toBeRefRewardAmt," - toBeRefAmt : ",this.toBeRefAmt);
    this.detailsModalDisplay = 'block';
    return true;
  }

  onInitiateRefund(){
    if(this.toBeRefOrderId == null || this.toBeRefOrderId == undefined || this.toBeRefOrderId == "")
      return false;

    if(this.toBeRefDealId == null || this.toBeRefDealId == undefined || this.toBeRefDealId == "")
      return false;

    if(confirm("Are you sure to refund deal?")){
      this.isLoading = true; 
      this.cartService.refundDeal(this.toBeRefOrderId, this.toBeRefDealId, this.isFullRefund)
      .subscribe(
        resData => {
          // console.log(resData);
          this.isLoading = false;
          
          this.toastrService.success("Deal refunded succsessfully");
          this.windowRefService.nativeWindow.location.reload();      
        },
        errorMessage => {
          this.isLoading = false;
          
          this.toastrService.error(errorMessage);
        }        
      );
    }
    return true;
    //this.router.navigate([`/user/dashboard/refund/${dealLink}/${orderId}`]);
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
