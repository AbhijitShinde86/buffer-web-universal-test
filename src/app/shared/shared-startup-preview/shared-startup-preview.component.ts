import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
// import 'quill-emoji/dist/quill-emoji.js';

import { QuillConfig } from '../../utilities/quill-config'
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-shared-startup-preview',
  templateUrl: './shared-startup-preview.component.html',
  styleUrls:['./shared-startup-preview.component.css']
})
export class SharedStartupPreviewComponent implements OnInit {
  @Input() startupLink: string;
  @Input() userType: string
  
  private userSub:Subscription;
  private commentSub:Subscription;
  private feedbackSub:Subscription;
  private itemSub: Subscription;
  
  isLoading = true; user:User; startupExpired = false;
  startup: any; betaBaseUrl=""; startupUrl;
  sharerUrl=""; sharerUrlTwitter=""; isCopied = false;
  commentText="";  cutTab ='comment'; reportText=""; 
  reportModalDisplay = 'none'; shareModalDisplay = 'none';
  comments=[]; feedbacks=[]; isVendor= false; quillConfig;
  isBrowser;

  constructor(private router:Router, private betaHomeService:BetaHomeService,
    private authService : AuthService, private meta:Meta, private title:Title, 
    @Inject(PLATFORM_ID) private platformId
  ) {   
    this.isBrowser = isPlatformBrowser(platformId);
      this.betaBaseUrl = environment.betaBaseUrl;
      this.userSub = this.authService.user.subscribe(user => {
        if(!!user){
          this.user = user;
        }
      });
      this.quillConfig = QuillConfig.getCommentQuillConfig();
  }

  ngOnInit(): void {   
    this.getStartupData();
    this.commentText = "";    
  }

  getStartupData(){
    this.isVendor = false;
    this.isLoading = true; 
    this.itemSub = this.betaHomeService.getStartUpPreviewByLink(this.startupLink, this.userType).subscribe(
      res => {
        if(res.data){
          this.startup = res.data;   
          // console.log(this.startup); 
          if(this.startup._id){
            if(this.user?.id == this.startup?.userId?._id)
              this.isVendor = true;
            this.setMetaData(); this.setTitle();
            if(this.startup?.endDate){
              const endDate = new Date(this.startup?.endDate);
              const currentDate: Date = new Date();
              this.startupExpired = endDate.getTime() < currentDate.getTime();
            }
          }
          else
            this.router.navigate([`${environment.betaBaseUrl}/`]);  
        } 
        else
          this.router.navigate([`${environment.betaBaseUrl}/`]);   
        
        this.isLoading = false;
    },
      errorMessage => { this.isLoading = false;
        this.router.navigate([`${environment.betaBaseUrl}/`]);    }
    )
  }
  
  onGoToProduct(){
    this.router.navigate([`${environment.betaBaseUrl}/${this.startupLink}`]); 
  }

  setMetaData() {
    const imageURL = this.startup?.imagePaths.length > 0 ? this.startup?.imagePaths[0].url_preview : null;
    this.meta.addTags([
      {name:'description', content:this.startup?.shortDesc},
      {name:'og:title', content:this.startup?.productName},
      {name:'og:description', content:this.startup?.shortDesc},
      {name:'og:url', content:this.startupUrl},
      {name:'twitter:title', content:this.startup?.productName},
      {name:'twitter:description', content:this.startup?.shortDesc}
    ]);
    if (imageURL){
      this.meta.addTag({name:'og:image', content:imageURL});
      this.meta.addTag({name:'twitter:image:src', content:imageURL});
    }
  }

  setTitle() {
    this.title.setTitle(this.startup?.productName);
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.commentSub){
      this.commentSub.unsubscribe();
    }
    if(this.feedbackSub){
      this.feedbackSub.unsubscribe();
    }    
    if(this.itemSub){
      this.itemSub.unsubscribe();
    }    
  }
}
