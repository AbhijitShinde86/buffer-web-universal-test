import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { VendorService } from 'src/app/services/vendor.service';
import { WindowRefService } from 'src/app/services/windowRef.service';
import { helper } from 'src/app/utilities/helper';

@Component({
  selector: 'app-vendor-deal',
  templateUrl: './vendor-deal.component.html',
  styles: [
  ]
})
export class VendorDealComponent implements OnInit {
  private routeSub:Subscription;
  
  isLoading = false; submitted = false; deal:any; dealLink:string; curMon;
  totAmount = 0; totCodeSold = 0; totCodeRef = 0; 
  grTotAmount = 0; grTotCodeSold = 0; grTotCodeRef = 0; 
  groupList = []; monthList = [];


  constructor(private route: ActivatedRoute, private router: Router,
    private vendorService:VendorService, private authService : AuthService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.dealLink = params['link'];
      if(this.dealLink)
        this.getDealData(this.dealLink);
    });          
  }

  ngOnInit(): void {
  }

  getDealData(dealLink){
    this.isLoading = true; 
    this.vendorService.getDealData(dealLink).subscribe(
      res => {
        if(res.data.length > 0){
          this.deal = res.data[0];
          this.getDealOrderData(this.deal._id)
        }
        // console.log(this.deal);
        this.isLoading = false; 
      },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }
  
  getDealOrderData(dealId){
    this.isLoading = true; 
    this.vendorService.getDealOrderData(dealId).subscribe(
      res => {
        const list = res.data.list;

        this.totAmount = list.map(i => i.deals.discPrice).reduce(function (x, y) { return x + y ; }, 0);; 
        this.totCodeSold = list.map(i => i.deals.noOfCodes).reduce(function (x, y) { return x + y ; }, 0);
        this.totCodeRef = list.filter(i => i.deals.isRefunded == true).map(i => i.deals.noOfCodes).reduce(function (x, y) { return x + y ; }, 0);

        this.groupList = res.data.groupList;
        // console.log(this.groupList);

        if(res.data.groupList.length > 0){
          this.curMon = res.data.groupList[0]._id;
          this.onChange(this.curMon);
        }

        this.groupList.forEach(group => {
          
          const obj = {
            listName:helper.getListName(group._id),
            commPer: group.list[0].deals.dealId.venderPer,
            codeAmount: group.list[0].deals.dealId.codeAmount,
            commAmt:(( +group.list[0].deals.dealId.codeAmount * +group.list[0].deals.dealId.venderPer) / 100),
            soldCodes : group.list.map(i => i.deals.noOfCodes).reduce(function (x, y) {
              return x + y ;
            }, 0),
            refCodes : group.list.filter(i => i.deals.isRefunded == true).map(i => i.deals.noOfCodes).reduce(function (x, y) {
              return x + y ;
            }, 0)
          };

          this.monthList.push({
            ...obj, 
            payCodes: obj.soldCodes- obj.refCodes,
            revenue: ( obj.commAmt * (obj.soldCodes- obj.refCodes) )
          });


          // const planGroup = group.list.reduce((group, product) => {
          //   const { deals } = product;
          //   group[deals.planId.planName] = group[deals.planId.planName] ?? [];
          //   group[deals.planId.planName].push(product.deals);
          //   return group;
          // }, {});
          
          // for (const key in planGroup) {
          //   if (planGroup.hasOwnProperty(key)) {          
          //     // console.log(planGroup[key]);
          //     const obj = {
          //       groupIndex : 1, listName:` - ${key}`,
          //       commPer: planGroup[key][0].planId.venderPer,
          //       discPrice:planGroup[key][0].discPrice,
          //       soldCodes : planGroup[key].map(i => i.noOfCodes).reduce(function (x, y) {
          //         return x + y ;
          //       }, 0),
          //       refCodes : planGroup[key].filter(i => i.isRefunded == true).map(i => i.noOfCodes).reduce(function (x, y) {
          //         return x + y ;
          //       }, 0)
          //     };

          //     this.monthList.push({
          //       ...obj, 
          //       commAmt:(( +obj.discPrice * +obj.commPer) / 100),
          //       payCodes: obj.soldCodes- obj.refCodes,
          //       revenue: ( (( +obj.discPrice * +obj.commPer) / 100) * (obj.soldCodes- obj.refCodes) )
          //     });
          //   }
          // }

        });
        // console.log(this.monthList);
        this.isLoading = false; 
      },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }

  onChange(id:string) {
    let newValue = this.groupList.find(o => o._id === id); 
    this.grTotAmount = newValue.list.map(i => i.deals.discPrice).reduce(function (x, y) { return x + y ; }, 0);; 
    this.grTotCodeSold = newValue.list.map(i => i.deals.noOfCodes).reduce(function (x, y) { return x + y ; }, 0);
    this.grTotCodeRef = newValue.list.filter(i => i.deals.isRefunded == true).map(i => i.deals.noOfCodes).reduce(function (x, y) { return x + y ; }, 0);

  }

  getListName(id){
    return helper.getListName(id);
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
