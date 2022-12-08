import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Params, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-public-dashboard',
  templateUrl: './public-dashboard.component.html',
  styles: [
  ]
})
export class PublicDashboardComponent implements OnInit {
  private routeSub:Subscription;

  isLoading = false; curUserData; imageSrc= null; 
  currTab="startups"; currUrl = ""; companyWebsite=null; username="";

  constructor(private route: ActivatedRoute, private router: Router, 
    private authService : AuthService, private userService:UserService,
    private toastrService:ToastrService
  ) { 
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.username = params['username'];
      if(this.username)
        this.getUserData();
    });  
  }

  ngOnInit(): void {
    this.currUrl = this.router.url; 
    const dashboardUrl = `/user/${this.username}`;
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.currUrl = event.url;
        this.currTab = this.currUrl.replace(`${dashboardUrl}/`,'');
      }
      if(event instanceof NavigationStart){
        this.currUrl = event.url;
        this.currTab = this.currUrl.replace(`${dashboardUrl}/`,'');
      }
    });
    this.currTab = this.currUrl.replace(`${dashboardUrl}/`,'');
    if(this.currUrl == dashboardUrl || this.currUrl == `${dashboardUrl}/`){
      this.currTab="startups";
      this.router.navigate([`${dashboardUrl}/startups`])
    }
  }

  getUserData(){
    this.isLoading = true; 
    this.userService.getUserByUsername(this.username).subscribe(
      res => {
        this.curUserData = res.data.length> 0 ? res.data[0] : null;
        // console.log(this.curUserData);  
        if(this.curUserData){
          if(this.curUserData?.photoUrl != '' && this.curUserData?.photoUrl != undefined &&  this.curUserData?.photoUrl != null)
            this.imageSrc = this.curUserData?.photoUrl?.url_preview;
  
          this.companyWebsite = this.curUserData?.companyWebsite == "undefined" ? '' : this.curUserData?.companyWebsite == "null" ? null : this.curUserData?.companyWebsite ;
  
          this.isLoading = false; 
        }
        else{
          this.router.navigate(['/'])
        }
    },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
