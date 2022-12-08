import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
// import 'quill-emoji/dist/quill-emoji.js';

import { QuillConfig } from '../../../utilities/quill-config'
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { CommentsService } from 'src/app/services/comments.service';
import { FeedbacksService } from 'src/app/services/feedbacks.service';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { StartupService } from 'src/app/services/startup.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { environment } from 'src/environments/environment';
import { SEOService } from '../../../services/SEO.service';
import { WindowRefService } from 'src/app/services/windowRef.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls:['./startup.component.css']
})
export class StartupComponent implements OnInit {
  private userSub:Subscription;
  private routeSub:Subscription;
  private commentSub:Subscription;
  private feedbackSub:Subscription;
  private itemSub: Subscription;
  
  isLoading = true; user:User; startupExpired = false;
  startupLink:string; startup: any; betaBaseUrl=""; vendorWebsiteUrl=null;
  startupUrl=null; sharerUrl=""; sharerUrlTwitter=""; isCopied = false;
  commentText="";  cutTab ='comment'; reportText=""; 
  reportModalDisplay = 'none'; shareModalDisplay = 'none';
  comments=[]; feedbacks=[]; isVendor= false; quillConfig;

  isBrowser;

  constructor(private route: ActivatedRoute, private router:Router, private betaHomeService:BetaHomeService, 
    private startupService: StartupService, private feedbacksService:FeedbacksService,
    private authService : AuthService, private commentsService:CommentsService,
    private toastrService:ShowToasterService,
    private meta:Meta, private title:Title, private seoService: SEOService,
    @Inject(PLATFORM_ID) private platformId: any, private windowRefService: WindowRefService
  ) {   
      this.isBrowser = isPlatformBrowser(platformId);
      this.betaBaseUrl = environment.betaBaseUrl;
      this.startup = null; 
      this.userSub = this.authService.user.subscribe(user => {
        if(!!user){
          this.user = user;
        }
      });
      this.routeSub = this.route.params.subscribe((params: Params) => {
        this.startupLink = params['link'];
        if(!this.startupLink)
          this.router.navigate([`${environment.betaBaseUrl}/`]);
        else{
          this.startupUrl = `${environment.domainURL}${environment.betaBaseUrl}/${this.startupLink}`;
          this.getStartupData();
        }
      });  
      this.commentSub = this.commentsService.comment.subscribe(comment => {
        if(comment){
          this.refreshComment();
        }
      });
      this.feedbackSub = this.feedbacksService.feedback.subscribe(feedback => {
        if(feedback){
          this.refreshFeedback();
        }
      });

      this.quillConfig = QuillConfig.getCommentQuillConfig();
  }

  ngOnInit(): void {    
    this.commentText = "";    
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
    // this.title.setTitle(this.startup?.productName);
    this.seoService.setPageTitle(this.startup?.productName);
  }
  
  createLinkForCanonicalURL() {
    this.seoService.createLinkForCanonicalURL();
  } 

  getStartupData(){
    this.isVendor = false;
    this.isLoading = true; 
    this.itemSub = this.betaHomeService.getStartUpByLink(this.startupLink).subscribe(
      res => {
        if(res.data?.length > 0){
          this.startup = res.data[0];   
          this.startup.imagePaths.sort(this.compareOrder);
          // console.log(this.startup); 
          if(this.user?.id == this.startup?.userId?._id)
            this.isVendor = true;
          this.setSharerUrl(this.startup);
          this.getComments(this.startup?._id);
          this.getFeedbacks(this.startup?._id);
          this.setMetaData(); this.setTitle(); this.createLinkForCanonicalURL();
          if(this.startup?.endDate){
            const endDate = new Date(this.startup?.endDate);
            const currentDate: Date = new Date();
            this.startupExpired = endDate.getTime() < currentDate.getTime();
          }
          this.vendorWebsiteUrl = `${this.startup?.websiteUrl}?ref="bufferapps"`
        } 
        else
          this.router.navigate([`${environment.betaBaseUrl}/`]);   
        
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false; 
        this.router.navigate([`${environment.betaBaseUrl}/`]);    }
    )
  }

  compareOrder(a, b) {
    return a.orderBy - b.orderBy;
  }

  setSharerUrl(startup){
    this.sharerUrl = `${this.startupUrl}`;
    this.sharerUrlTwitter = `${startup.productName}: ${startup.shortDesc} ${this.startupUrl}`;
  }
  
  getComments(startupId:string){
    this.commentsService.getStartUpComments(startupId,this.startup.userId._id).subscribe(
      res => {
        this.comments = res.data;
        this.isLoading = false;
    },
    errorMessage => { this.isLoading = false; }
    ); 
  }

  getFeedbacks(startupId:string){
    this.feedbacksService.getStartUpFeedbacks(startupId,this.startup.userId._id).subscribe(
      res => {
        this.feedbacks = res.data;
        this.isLoading = false;
        // console.log("this.feedbacks : ",this.feedbacks)
    },
    errorMessage => { this.isLoading = false; }
    ); 
  }

  onStartupFeedbackClick(startupLink:string){
    if(this.user)
      this.router.navigate([`${environment.betaBaseUrl}/${startupLink}/feedback`]);
    else
      this.authService.setLaunchLogin({"action":"Startup Feedback"});
  }

  onJoinBetaClick(startupLink:string){
    if(this.startup.adminRequestFilter.length > 0){
      if(this.user){  
        const request = {
          startupId :this.startup._id,
          startupUserId : this.startup.userId._id,
          betaReqAdminId: this.startup.adminRequestFilter[0]._id
        }
  
        if(confirm("Are you sure to raise join beta request?")) {
          this.isLoading = true; 
          this.startupService.joinBeta(request).subscribe(
            resData => {
              //console.log(resData);
              this.isLoading = false; 
              this.toastrService.success("Join beta request raised successfully");
              if(isPlatformBrowser(this.platformId)) {
                this.windowRefService.nativeWindow.location.reload();
              }
            },
            errorMessage => {
              this.isLoading = false; 
              this.toastrService.error(errorMessage);
            }        
          );
        }
      }
      else
        this.authService.setLaunchLogin({"action":"Join Beta"});      
    }else{
      this.router.navigate([`/join-beta`]);
    }
  }

  onLikeClick(){
    if(this.user){
      if(this.startup.userLikeCount == 0){
        this.betaHomeService.addStartupLike(this.startup._id).subscribe(
          resData => {
            this.updateStartupLike('add');
          },
          errorMessage => {}  
        );
      }else{
        this.betaHomeService.removeStartupLike(this.startup._id).subscribe(
          resData => {
            this.updateStartupLike('remove');
          },
          errorMessage => {}  
        );
      }
    }
    else
      this.authService.setLaunchLogin({"action":"Like"});
  }

  updateStartupLike(action:string){
    this.startup.userLikeCount = this.startup.userLikeCount == 0 ? 1 : 0;
    this.startup.likeCount = action == 'add' ? (this.startup.likeCount + 1) : (this.startup.likeCount - 1); 
  }

  postComment(){
    if(this.commentText != "" && this.commentText != undefined && this.commentText != null){   
      const comment = {
        startupId: this.startup._id, 
        commentText: this.commentText, 
        parentId: null,
        startupUserId: this.startup.userId._id
      };
      if(confirm("Are you sure post comment?")) {
        this.isLoading = true;  
        this.commentsService.addComment(comment).subscribe(
          resData => {
            //console.log(resData);
            this.commentText="";
            this.isLoading = false;      
            this.toastrService.success("Comment posted successfully");       
            this.getComments(this.startup?._id);
          },
          errorMessage => {
            this.isLoading = false;           
            this.toastrService.error(errorMessage);
          }  
        );
      }
    }
  }

  onContentChanged = (event) => {
    //console.log("onContentChanged : ", event.html);
  }
  
  refreshComment(){
    this.getComments(this.startup?._id)
  }

  refreshFeedback(){
    this.getFeedbacks(this.startup?._id)
  }

  onShowReportModel(){
    if(this.user){
      this.reportText = "";
      this.reportModalDisplay = 'block';
    }
    else
      this.authService.setLaunchLogin({"action":"Report Startup"});
  }

  onSubmitReport(){
    if(this.reportText != "" && this.reportText != undefined && this.reportText != null){ 
      const report = {
        startupId: this.startup._id, 
        reportText: this.reportText
      };

      if(confirm("Are you sure to report startup?")) {
        this.isLoading = true;  
        this.startupService.reportStartup(report).subscribe(
          resData => {
            //console.log(resData);
            this.reportText="";      
            this.reportModalDisplay = 'none';
            this.isLoading = false;      
            this.toastrService.success("Report Submitted Successfullyy"); 
          },
          errorMessage => {
            this.isLoading = false;           
            this.toastrService.error(errorMessage);
          }  
        );
      }
    }
  }

  getFacebookUrl(urlPart:string){
    return `https://www.facebook.com/${urlPart}`;
  }
  
  getTwitterUrl(urlPart:string){
    return `https://www.twitter.com/${urlPart}`;    
  }
  
  // getLinkedinUrl(urlPart:string){
  //   return `https://www.linkedin.com/in/${urlPart}`;    
  // }
  getLinkedinUrl(urlPart:string){
    return `${urlPart}`;
  }

  onShowShareModel(){
    this.isCopied = false;
    this.shareModalDisplay = 'block';
  }
  
  copyStartupUrl(inputElement){
    this.isCopied = true;
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  onLaunchLogin(){
    if(!this.user)
      this.authService.setLaunchLogin({"action":"Comment"});
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
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
