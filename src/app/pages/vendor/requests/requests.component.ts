import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { VendorService } from 'src/app/services/vendor.service';
import { WindowRefService } from 'src/app/services/windowRef.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styles: [
  ]
})
export class RequestsComponent implements OnInit {
  private routeSub: Subscription;

  requestsData = []; isLoading = false; startupLink; prevUrl;

  constructor(private authService: AuthService, private vendorService:VendorService,
    private router:Router, private route: ActivatedRoute,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.startupLink = params['link'];
      if(this.startupLink)
        this.getVendorRequestsData();
    });  
  }

  ngOnInit(): void {
  }
  
  getRequests(status){
    return this.requestsData.filter((s) => s.reqStatus === status);
  }

  getVendorRequestsData(){
    this.isLoading = true; 
    this.vendorService.getRequests(this.startupLink).subscribe(
      res => {
        this.requestsData = res.data;
        // console.log(this.requestsData)
        this.isLoading = false; 
      },
        errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
      )
  }

  onSelectedRequestClick(requestId){
    this.router.navigate([`/vendor/requests/${this.startupLink}/${requestId}`]);
  }

  onGoToBack(){   
      this.router.navigate([`/vendor${environment.betaBaseUrl}/${this.startupLink}`]);
  }
  
  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
