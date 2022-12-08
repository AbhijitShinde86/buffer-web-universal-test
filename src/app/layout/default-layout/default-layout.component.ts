import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styles: [
  ]
})
export class DefaultLayoutComponent implements OnInit {
  private userSub:Subscription; 
  user:User;
  currUrl="/"; isBaseModule = false;
  isBetaModule = false; isDealsModule = false;  

  constructor(private router:Router, private authService : AuthService
  ) {
      this.userSub = this.authService.user.subscribe(user => {        
        if(!!user){
          this.user = user;
        }else{
        }
      });
  }

  ngOnInit(): void {
    this.currUrl = this.router.url; 
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.currUrl = event.url;
      }
      if(event instanceof NavigationStart){
        this.currUrl = event.url;
      }
    })
    this.isBetaModule = this.currUrl.startsWith(environment.betaBaseUrl);
    this.isDealsModule = this.currUrl.startsWith(environment.dealsBaseUrl);
    this.isBaseModule = this.currUrl == '/'
  }
  
  
  ngOnDestroy() {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
