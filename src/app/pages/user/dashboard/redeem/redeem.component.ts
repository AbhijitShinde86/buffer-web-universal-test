import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { DealService } from 'src/app/services/deal.service';
import { DealHomeService } from 'src/app/services/deal_home.service';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-redeem',
  templateUrl: './redeem.component.html',
  styles: [
  ]
})
export class RedeemComponent implements OnInit {
  private routeSub:Subscription;
  private itemSub: Subscription;

  isLoading = true; dealLink:string; orderId:string; dealOrder: any; 

  constructor(private route: ActivatedRoute, private router:Router,
    private userService : UserService,
    private toastrService:ShowToasterService, private windowRefService: WindowRefService
  ) 
  { 
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.dealLink = params['link'];
      this.orderId = params['orderId'];
      if(this.dealLink && this.orderId)
        this.getDealData();
      else
        this.router.navigate([`${environment.dealsBaseUrl}/`]);
    }); 
  }

  ngOnInit(): void {
  }

  getDealData(){
    this.isLoading = true; 
    this.itemSub = this.userService.getDealOrderByLink(this.dealLink, this.orderId).subscribe(
      res => {
        if(res.data?.length > 0){
          this.dealOrder = res.data[0];    
        } 
        else
          this.router.navigate([`${environment.dealsBaseUrl}/`]);   
        
        // console.log(this.dealOrder);
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  }
    )
  }

  onGoToDeals(){
    this.router.navigate([`/user/dashboard/purchased-deals`]);
  }
  
  onViewProduct(dealLink:string){
    this.router.navigate([`${environment.dealsBaseUrl}/${dealLink}`]);
  }
  
  onGoToProduct(websiteUrl:string){
    const redeemUrl = `${websiteUrl}?ref="bufferapps"`;
    if(redeemUrl)
    this.windowRefService.nativeWindow.open(redeemUrl, "_blank");
  }
  
  copyRewardCode(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  
  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
    if(this.itemSub){
      this.itemSub.unsubscribe();
    }    
  }
}
