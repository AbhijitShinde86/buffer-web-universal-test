import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { VendorService } from 'src/app/services/vendor.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-vendor-beta',
  templateUrl: './vendor-beta.component.html',
  styles: [
  ]
})
export class VendorBetaComponent implements OnInit {
  private routeSub:Subscription;
  
  isLoading = false; submitted = false; startup; startupLink;

  constructor(private route: ActivatedRoute, private router: Router,
    private vendorService:VendorService, private authService : AuthService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.startupLink = params['link'];
      if(this.startupLink)
        this.getStartupData(this.startupLink);
    });          
  }

  ngOnInit(): void {
  }

  getStartupData(startupLink){
    this.isLoading = true; 
    this.vendorService.getStartupData(startupLink).subscribe(
      res => {
        if(res.data.length > 0)
          this.startup = res.data[0];
        // console.log(this.startup);
        this.isLoading = false; 
      },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }
  
  onBetaRequests(link:string){
    this.router.navigate([`vendor/requests/${link}`]);
  }
  
  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
