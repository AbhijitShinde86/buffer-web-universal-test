import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

import { UrlService } from './shared/url.service';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './shared/logging.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from './auth/user.model';
import { environment } from 'src/environments/environment';


export interface Response{
  status:{
    code:number
    message: string
  },
  data:any | null 
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  previousUrl: string = null;
  currentUrl: string = null;

  static isBrowser = new BehaviorSubject<boolean>(null!);

  private userSub:Subscription; 
  user:User;
  currUrl="/"; isBaseModule = false;   
  isBetaModule = false; isDealsModule = false;  
  isVendorModule = false;
  constructor( @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService, private loggingService: LoggingService,
    private router: Router, private urlService: UrlService
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));

    this.userSub = this.authService.user.subscribe(user => {        
      if(!!user){
        this.user = user;
      }else{
      }
    });
  }

  ngOnInit() {
    this.authService.autoLogin();
    // this.loggingService.printLog('Hello from App Component ngOnInit');
    // this.router.events.pipe(
    //   filter((event) => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
     
    //   this.previousUrl = this.currentUrl;
    //   this.currentUrl = event.url;
    //   this.urlService.setPreviousUrl(this.previousUrl);
    // });

    this.currUrl = this.router.url; 
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.currUrl = event.url;

        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        this.urlService.setPreviousUrl(this.previousUrl);

        this.isBetaModule = this.currUrl.startsWith(environment.betaBaseUrl);
        this.isDealsModule = this.currUrl.startsWith(environment.dealsBaseUrl);
        this.isVendorModule = this.currUrl.startsWith("/vendor");
        // console.log("NavigationEnd - isVendorModule : ",this.isVendorModule);  
        this.isBaseModule = this.currUrl == '/'
      }
      if(event instanceof NavigationStart){
        this.currUrl = event.url;
        
        this.isBetaModule = this.currUrl.startsWith(environment.betaBaseUrl);
        this.isDealsModule = this.currUrl.startsWith(environment.dealsBaseUrl);
        this.isVendorModule = this.currUrl.startsWith("/vendor"); 
        // console.log("NavigationStart - isVendorModule : ",this.isVendorModule); 
        this.isBaseModule = this.currUrl == '/'
      }
    })
  }
  
  
  ngOnDestroy() {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
