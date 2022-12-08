import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { VendorService } from 'src/app/services/vendor.service';
import { WindowRefService } from 'src/app/services/windowRef.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styleUrls:['./vendor-home.component.css']
})
export class VendorHomeComponent implements OnInit {
  private userSub: Subscription;

  user:User; productsData = []; isLoading = false; 

  constructor(private authService: AuthService, private vendorService:VendorService,
    private betaHomeService:BetaHomeService, private router:Router,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        this.getVendorHomeData();
      }
    });
  }

  ngOnInit(): void {
  }
  
  getVendorHomeData(){
    this.isLoading = true; 
    this.vendorService.getVendorHomeData(this.user.id).subscribe(
      res => {
        this.productsData = res.data;
        // console.log(this.productsData)
        this.isLoading = false; 
      },
        errorMessage => { this.productsData = []; this.isLoading = false;  this.toastrService.error(errorMessage); }
      )
  }
  
  getStatusName(status:string){
    return status == 'dec' ? 'Declined' : status == 'fet' ? 'Featured' : status == 'acc' ? 'Accepted' : 'Draft';
  }

  onViewClick(type:string, link:string){
    if(type.toLowerCase() == 'beta'){
      this.router.navigate([`/vendor/beta/${link}`]);
    }else{
      this.router.navigate([`/vendor/deals/${link}`]);
    }
  }

  onDeleteClick(type:string, id:string){
    let endpointName = "deleteDeal";
    if(type.toLowerCase() == 'beta')
      endpointName = "deleteStartup";

    if(confirm(`Are you sure to delete ${type.toLowerCase()}?`)) {
      this.isLoading = true; 
      this.vendorService.deleteProduct(id, endpointName).subscribe(
        resData => {
          //console.log(resData);
          this.isLoading = false;
          
          this.getVendorHomeData();
        },
        errorMessage => {
          this.isLoading = false; 
           
          this.toastrService.error(errorMessage);
        }        
      );
    }

  }

  onSubmitProduct(){
    this.router.navigate([`${environment.betaBaseUrl}/new`])
  }
  
  onSubmitDeal(){
    this.router.navigate([`${environment.dealsBaseUrl}/new`])
  }
  
  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }

}
