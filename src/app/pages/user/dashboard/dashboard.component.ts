import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  private userSub: Subscription;

  isLoading = false; curUserData; user:User; imageSrc= null; 
  currTab="profile"; currUrl = ""; companyWebsite=null;

  constructor(private router: Router, private authService : AuthService, private userService:UserService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        this.getUserData();
      }
    });
  }

  ngOnInit(): void {
    this.currUrl = this.router.url; 
    const dashboardUrl = `/user/dashboard`;
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
      this.currTab="profile";
      this.router.navigate([`${dashboardUrl}/profile`])
    }    
  }

  getUserData(){
    this.isLoading = true; 
    this.userService.getUserForDashboard(this.user.id).subscribe(
      res => {
        this.curUserData = res.data.length > 0 ? res.data[0] : null;
        // console.log(this.curUserData);  
   
        if(this.curUserData?.photoUrl != '' && this.curUserData?.photoUrl != undefined &&  this.curUserData?.photoUrl != null)
          this.imageSrc = this.curUserData?.photoUrl?.url_preview;

        this.companyWebsite = this.curUserData?.companyWebsite == "undefined" ? '' : this.curUserData?.companyWebsite == "null" ? null : this.curUserData?.companyWebsite ;

        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
