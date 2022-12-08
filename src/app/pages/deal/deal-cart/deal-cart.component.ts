import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
;
import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { CartService } from 'src/app/services/cart.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { environment } from 'src/environments/environment';
import { UrlService } from 'src/app/shared/url.service';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-deal-cart',
  templateUrl: './deal-cart.component.html',
  styles: [
  ]
})
export class DealCartComponent implements OnInit {
  previousUrl: Observable<string> = this.urlService.previousUrl$;
  private userSub:Subscription;
  appCurSign = environment.appCurSign;

  isLoading = true; user:User; stripe:any; qtyList = []; balRewardAmt = 0;
  deals = []; subTotal = 0; subDiscAmount = 0; rewardAmt = 0; 
  discAmt = 0; totalAmt = 0; cartPromo = null; couponCode= ''; couponError = null; 
  stripeId:any; countryId=null; countryData; countryList=[]; prevUrl;

  constructor(private router:Router, private authService:AuthService,
    private cartService :CartService, private urlService: UrlService, private checkoutService:CheckoutService,
    private toastrService:ShowToasterService
  ) {     
    this.setCartPromoDefaultVal();      
    this.getCountryList();
    this.loadQuantityList();
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    this.urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.prevUrl= previousUrl;
    });
  }

  onQuantityChange(index, event){
    const quantity = event.target.value;
    const deal = this.deals[index];
    const oldQty = this.deals[index].quantity;
    this.isLoading = true; 
    this.cartService.updateQuantity(deal._id,quantity).subscribe(
      res => {
        this.setData(res.data);
        this.deals[index].amount = deal.discPrice * quantity;
        this.calculateAmounts();
        this.isLoading = false; 
      },
      errorMessage => {
        this.getCartData();
        this.isLoading = false; 
        this.toastrService.error(errorMessage);
      }        
    );
  }

  onPlanChange(index, planId){
    const deal = this.deals[index];
    this.isLoading = true; 
    this.cartService.updatePlan(deal._id,planId).subscribe(
      res => {
        this.setData(res.data);
        this.calculateAmounts();
        this.isLoading = false; 
      },
      errorMessage => {
        this.getCartData();
        this.isLoading = false; 
        this.toastrService.error(errorMessage);
      }        
    );
  }

  onCountryChange(countryId){
    // console.log("onCountryChange - countryId : ",countryId);
    // console.log("countryList : ",this.countryList);
    this.countryData = null;
    if(countryId){
      const filterData = this.countryList.filter(data => data._id == countryId);
      if(filterData.length > 0)
        this.countryData = filterData[0];
    }
  }

  setData(data:any){
    // console.log("data : ",data);
    this.deals = data;
    this.setCartCount(this.deals.length);
    if(this.deals.length > 0){
      this.calculateAmounts();
    } 
  }

  setCartCount(ccnt:Number) {
    const updatedUser = { ...this.user, ccnt: ccnt };
    this.authService.updateCartCount(ccnt, updatedUser);
  }

  deleteDeal(id: any): void {
    if(confirm("Are you sure to delete deal?")) {
      this.cartService.deletCartDeal(id).subscribe(
        resData => {
          this.getCartData();
        },
        errorMessage => {}  
      );
    }
  }

  onPlaceOrder(){
    if(this.deals?.length > 0){ 
      this.calculateAmounts();
      if(this.subTotal > 0){
        if(this.totalAmt > 0){
          if(!this.countryData){
            this.toastrService.info("Please select country");
            return;
          }
          this.updateCountry();
        }else{
          const userId = this.user.id;
          const name = this.user.name;
          const email = this.user.email;
          const cartDelas = this.deals;
          const cartAmounts = {
            subTotalAmount : this.subTotal, 
            subDiscAmount : this.subDiscAmount,
            rewardAmount: this.rewardAmt,  
            couponAmount: this.discAmt,
            totalAmount: this.totalAmt
          };
          const transData = {
            customerId: this.stripeId
          }
          const cartCoupon = this.cartPromo;         
          const orderRequest = { userId, name, email, cartDelas, cartAmounts, cartCoupon, transData, isRewardsOrder: true };
          // console.log("orderRequest : ", orderRequest);
          
          // if(confirm("Are you sure to place order?")) 
          // {
            this.isLoading = true; 
            this.cartService.createOrder(orderRequest)
            .subscribe(
              resData => {
                // console.log(resData);
                this.isLoading = false;
                
                this.setCartCount(0);
                this.router.navigate([`${environment.dealsBaseUrl}/purchase-thankyou`]);         
              },
              errorMessage => {
                this.isLoading = false;
                
                this.toastrService.error(errorMessage);
              }        
            );
          // }
        }
      }
    }    
  }

  updateCountry(){
    if(this.countryId == this.countryData._id){
      // this.router.navigate([`${environment.dealsBaseUrl}/checkout`]);
      this.getCartDataForCheckout();
    }
    else{
      this.isLoading = true; 
      this.cartService.updateCountry(this.user.id,this.countryData).subscribe(
        res => {
          this.isLoading = false; 
          // this.router.navigate([`${environment.dealsBaseUrl}/checkout`]);
          this.getCartDataForCheckout();
        },
        errorMessage => {
          this.countryId=null; 
          this.countryData = null;
          this.isLoading = false; 
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }

  onContinueShopping(){
    this.router.navigate([`${environment.dealsBaseUrl}`]);
  }

  calculateAmounts(){    
    this.subTotal = 0.0; this.discAmt = 0.0; this.totalAmt = 0.0, 
    this.subDiscAmount =0.0; this.rewardAmt = 0.0; 
    
    const calItemTotal = this.deals.reduce(function(sum, current) {
      const calAmount = (+current.discPrice * + current.quantity);
      return sum + calAmount;
    }, 0);

    const calItemDiscTotal = this.deals.reduce(function(sum, current) {
      const calAmount = (+current.discAmount * + current.quantity);
      return sum + calAmount;
    }, 0);

    this.subDiscAmount = calItemDiscTotal;
    this.subTotal = calItemTotal; 

    let discAmount = 0; 
    discAmount = this.cartPromo.couponPer > 0 ? ((+this.subTotal * this.cartPromo.couponPer ) / 100) : 0;
    this.cartPromo.amount = discAmount;
    this.discAmt = discAmount;

    let calTotAmount = ( +this.subTotal - +this.discAmt )

    this.rewardAmt =this.balRewardAmt;
    if(this.balRewardAmt > 0 && this.balRewardAmt > calTotAmount){
      this.rewardAmt = calTotAmount;
    }  
    
    this.totalAmt = (+calTotAmount - +this.rewardAmt);
    // console.log("subTotal : ", this.subTotal);
    // console.log("rewardAmt : ", this.rewardAmt);
    // console.log("discAmt : ", this.discAmt);
    // console.log("totalAmt : ", this.totalAmt);
  }

  getCartData(){
    this.deals = []; this.calculateAmounts();
    this.isLoading = true; 
    this.cartService.getCart().subscribe(
      res => {
        this.setData(res.data); 
        // console.log(this.deals);
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  }
    )
  }

  getCartUserData(){
    this.deals = []; this.calculateAmounts();
    this.isLoading = true; 
    this.cartService.getCartUser().subscribe(
      res => {   
        // console.log(res.data);    
        if(res.data.length > 0){ 
          this.balRewardAmt = res.data[0].balRewardAmt ?? 0;   
          this.stripeId = res.data[0].stripeId;  
          this.countryId= res.data[0].countryId;  
          this.onCountryChange(this.countryId);
        } 
        this.isLoading = false; 
      },
      errorMessage => { this.isLoading = false;  }
    )
  }

  loadQuantityList() {
    this.qtyList.push({ qtyName: 'One', qty: 1 });
    this.qtyList.push({ qtyName: 'Two', qty: 2 });
    this.qtyList.push({ qtyName: 'Three', qty: 3 });
    this.qtyList.push({ qtyName: 'Four', qty: 4 });
    this.qtyList.push({ qtyName: 'Five', qty: 5 });
    this.qtyList.push({ qtyName: 'Six', qty: 6 });
    this.qtyList.push({ qtyName: 'Seven', qty: 7 });
    this.qtyList.push({ qtyName: 'Eight', qty: 8 });
    this.qtyList.push({ qtyName: 'Nine', qty: 9 });
    this.qtyList.push({ qtyName: 'Ten', qty: 10 });
  }

  getCountryList(){
    this.countryList = [];
    this.isLoading = true; 
    this.cartService.getCountryList().subscribe(
      res => {
        this.countryList = res.data;
        // console.log(this.countryList);
        this.getCartUserData();
        this.getCartData(); 
        this.isLoading = false; 
      },
      errorMessage => { this.isLoading = false;  }
    )
  }

  onGoBack(){
    if(this.prevUrl)
      this.router.navigate([`${this.prevUrl}`]);
    else
      this.router.navigate([`${environment.dealsBaseUrl}`]);
  }

  getCartDataForCheckout(){
    this.isLoading = true; 
    this.cartService.getCart().subscribe(
      res => {
        const deals = res.data;
        if(deals.length > 0){
          const balRewardAmt = deals[0].balRewardAmt;          
          const stripeId = deals[0].stripeId;
          const countryId = deals[0]?.countryId;  
          const countryCode2D= deals[0]?.countryCode2D;  
          const currencyCode= deals[0]?.currencyCode;  

          let subTotal = 0, discAmt = 0, totalAmt = 0, subDiscAmount =0, rewardAmt = 0; 
          
          const calItemTotal = deals.reduce(function(sum, current) {
            const calAmount = (+current.discPrice * + current.quantity);
            return sum + calAmount;
          }, 0);

          const calItemDiscTotal = deals.reduce(function(sum, current) {
            const calAmount = (+current.discAmount * + current.quantity);
            return sum + calAmount;
          }, 0);

          subDiscAmount = calItemDiscTotal;
          subTotal = calItemTotal; 

          let discAmount = 0; 
          discAmount = this.cartPromo.couponPer > 0 ? ((+this.subTotal * this.cartPromo.couponPer ) / 100) : 0;
          this.cartPromo.amount = discAmount;
          discAmt = discAmount;

          let calTotAmount = ( +subTotal - +discAmt )

          rewardAmt =balRewardAmt;
          if(balRewardAmt > 0 && balRewardAmt >= calTotAmount){
            rewardAmt = calTotAmount - 1;
          }  
          
          totalAmt = (+calTotAmount - +rewardAmt);

          if(countryId && countryCode2D && currencyCode){    
            if(totalAmt > 0){
              this.createPaymentIntent(totalAmt, countryCode2D, currencyCode, stripeId);
            }
          }
        } 
        else{
          this.router.navigate([`${environment.dealsBaseUrl}`]);
        }
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  }
    )
  }

  createPaymentIntent(amount:Number,countryCode2D:string, currencyCode:string, stripeId:string){
    this.isLoading = true; 
    this.cartService
    .createPaymentIntent({
      userId: this.user.id,
      name: this.user.name, 
      email: this.user.email,
      amount: amount,
      country:countryCode2D,
      currency:currencyCode,
      stripeId: stripeId
    }).subscribe(
      resData => {
        // console.log(resData);
        this.checkoutService.setCheckoutData({ ...resData.data, cartPromo: this.cartPromo});
        this.router.navigate([`${environment.dealsBaseUrl}/checkout`],{queryParams: {client_secret: resData.data.client_secret }})
        this.isLoading = false;
            
      },
      errorMessage => {
        this.isLoading = false;
        
        this.toastrService.error(errorMessage);
      }  
    );
  }

  onApplyPromo(){
    this.couponError = null;

    this.isLoading = true; 
    this.cartService.applyPromo(this.user.id,this.couponCode,this.totalAmt).subscribe(
      resData => {
        // console.log("resData : ", resData);
        this.isLoading = false;       

        const coupon = resData.data;
        let discAmount = 0;
        discAmount = Math.round((this.totalAmt * coupon.percent ) / 100);
        // if(discAmount > coupon.perMaxDisc)
        //     discAmount = coupon.perMaxDisc;
        this.cartPromo = { 
          id : coupon._id, code : coupon.couponCode, amount : discAmount, 
          couponPer :coupon.percent , couponTransId : coupon.couponTransId
        };
        // console.log(this.cartPromo)
        this.calculateAmounts();
        // this.toastrService.success("Coupon applied successfully.");
      },
      errorMessage => {
        this.couponCode = null;
        this.isLoading = false; 
        this.showCouponError(errorMessage);
      }        
    );
  }

  onRemovePromo(){
    this.couponError = null;
    if(this.cartPromo.code && this.cartPromo.couponTransId){
      this.isLoading = true; 
      
      this.cartService.removePromo(this.cartPromo.couponTransId).subscribe(
        resData => {
          //console.log(resData);
          this.isLoading = false;
          
          this.couponCode = null;
          this.setCartPromoDefaultVal();
          this.calculateAmounts();
          // this.toastrService.success("Coupon removed successfully.");
        },
        errorMessage => {
          this.isLoading = false; 
           
          this.showCouponError(errorMessage);
        }        
      );
    }
  }

  setCartPromoDefaultVal(){
    this.cartPromo = { 
      id : null, code : null, amount : 0, couponPer:0, couponTransId : null
    }
  }

  showCouponError(errorMessage){
    // console.log( errorMessage)
    this.couponError = errorMessage;
    setTimeout(() => {
      this.couponError= null;    
    }, 2000);
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}

  // onCreateCheckouSession(){   
  //   if(this.deals?.length > 0){ 
  //     this.calculateAmounts();
  //     // if(confirm("Are you sure to place order?")) 
  //     {
  //       this.isLoading = true;
  //       
  //       const userId = this.user.id;
  //       const cartDelas = this.deals;
  //       const cartAmounts = {
  //         subTotalAmount : this.subTotal, 
  //         subDiscAmount : this.subDiscAmount,
  //         rewardAmount: this.rewardAmt,  
  //         couponAmount: this.discAmt,
  //         totalAmount: this.totalAmt
  //       };
  //       const cartCoupon = this.cartPromo;         
  //       const orderRequest = { userId, cartDelas, cartAmounts, cartCoupon };
  //       // console.log("orderRequest : ", orderRequest);
  //       this.cartService.createCheckoutSession(orderRequest)
  //       .subscribe(
  //         resData => {
  //           // console.log(resData);
  //           this.loadStripCheckout(resData.data.sessionId);
  //           this.isLoading = false;
  //                  
  //         },
  //         errorMessage => {
  //           this.isLoading = false;
  //           
  //           this.toastrService.error(errorMessage);
  //         }        
  //       );
  //     }
  //   }
  // }

  // async loadStripCheckout(sessionId:string){
  //   this.stripe = await loadStripe(environment.stripeClientKey);
  //   this.stripe.redirectToCheckout({ sessionId:sessionId }); 
  // }