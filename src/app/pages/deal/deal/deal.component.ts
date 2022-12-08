import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
;
import { Subscription } from 'rxjs';

import { QuillConfig } from '../../../utilities/quill-config'
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DealService } from 'src/app/services/deal.service';
import { DealHomeService } from 'src/app/services/deal_home.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { ReviewService } from 'src/app/services/review.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/services/cart.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls:['./deal.component.css']
})
export class DealComponent implements OnInit {
  private userSub:Subscription;
  private routeSub:Subscription;
  private questionSub:Subscription;
  private reviewSub:Subscription;
  private itemSub: Subscription;

  isLoading = true; user:User; isVendor= false; dealExpired = false;
  dealLink:string; deal: any; curPlan = null;
  reportModalDisplay = 'none'; reviewModalDisplay = 'none';
  reportText=""; question="";  cutTab ='question';
  reviewForm: FormGroup; submitted = false; quillConfig;
  reviewRating = 0; questions =[]; reviews =[];

  isBrowser;

  constructor(private route: ActivatedRoute, private router:Router,
    private authService : AuthService, private dealHomeService:DealHomeService, 
    private dealService : DealService, private reviewService: ReviewService, 
    private cartService : CartService,
    private questionsService: QuestionsService, private formBuilder: FormBuilder,
    private toastrService:ShowToasterService, @Inject(PLATFORM_ID) private platformId
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
    this.deal = null; 
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
      }
    });
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.dealLink = params['link'];
      if(!this.dealLink)
        this.router.navigate([`${environment.dealsBaseUrl}/`]);
      else
        this.getDealData();
    }); 
    this.questionSub = this.questionsService.question.subscribe(question => {
      if(question){
        this.refreshQuestion();
      }
    });
    this.reviewSub = this.reviewService.review.subscribe(review => {
      if(review){
        this.refreshReview();
      }
    });

    this.quillConfig = QuillConfig.getCommentQuillConfig();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  getDealData(){
    this.isVendor = false; this.curPlan = null;
    this.isLoading = true; 
    this.itemSub = this.dealHomeService.getDealByLink(this.dealLink).subscribe(
      res => {
        if(res.data?.length > 0){
          this.deal = res.data[0];    
          this.deal.imagePaths.sort(this.compareOrder);
          if(this.user?.id == this.deal?.userId?._id)
            this.isVendor = true;
          this.getQuestions(this.deal?._id);
          this.getReviews(this.deal?._id);
          if(this.deal.plans?.length >0 )
            this.curPlan = this.deal.plans[0];            
          if(this.deal?.endDate){
            const endDate = new Date(this.deal?.endDate);
            const currentDate: Date = new Date();
            this.dealExpired = endDate.getTime() < currentDate.getTime();
          }
        } 
        else
          this.router.navigate([`${environment.dealsBaseUrl}/`]);   
        
        // console.log(this.deal);
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  
        this.router.navigate([`${environment.dealsBaseUrl}/`]);   }
    )
  }

  compareOrder(a, b) {
    return a.orderBy - b.orderBy;
  }
  
  getQuestions(dealId:string){
    this.questionsService.getDealQuestions(dealId,this.deal?.userId?._id).subscribe(
      res => {
        this.questions = res.data;
        this.isLoading = false;
        // console.log("questions : ",this.questions)
    },
    errorMessage => { this.isLoading = false; }
    ); 
  }

  getDealTypeName(dealType:Number){
    return dealType == 1 ? 'Lifetime Deal' :  dealType == 2 ?'Annual' : 'Freebie';
  }

  getReviews(dealId:string){    
    this.reviewService.getReviews(dealId, this.deal?.userId?._id).subscribe(
      res => {
        this.reviews = res.data;
        this.isLoading = false;
        // console.log("reviews : ",this.reviews)
    },
    errorMessage => { this.isLoading = false; }
    ); 
  }

  
  postQuestion(){
    if(this.question != "" && this.question != undefined && this.question != null){   
      const question = {
        dealId: this.deal._id, 
        question: this.question, 
        parentId: null,
        dealUserId: this.deal.userId._id
      };
      if(confirm("Are you sure post question?")) {
        this.isLoading = true;  
        this.questionsService.addQuestion(question).subscribe(
          resData => {
            //console.log(resData);
            this.question="";
            this.isLoading = false;      
            this.toastrService.success("Question posted successfully");       
            this.getQuestions(this.deal?._id);
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
  
  refreshQuestion(){
    //console.log("refreshQuestion - deal : ",this.deal)
    this.getQuestions(this.deal?._id)
  }

  refreshReview(){
    //console.log("refreshReview - deal : ",this.deal)
    this.getReviews(this.deal?._id)
  }


  onBuyNow(){
    if(!this.user){
      this.authService.setLaunchLogin({"action":"Buy Now"});
      return false;
    }

    if(this.curPlan == null  || this.curPlan == undefined){
      return false;
    }

    const deal = {
      dealId : this.deal._id,  
      planId: this.curPlan._id
    };

    this.isLoading = true;  
      this.cartService.addDealToCart(deal).subscribe(
        resData => {
          // console.log(resData);
          this.isLoading = false;     
          this.router.navigate([`${environment.dealsBaseUrl}/cart`])
        },
        errorMessage => {
          this.isLoading = false;           
          this.toastrService.error(errorMessage);
        }  
    );
    return true;
  }

  onShowReportModel(){
    if(this.user){
      this.reportText = "";
      this.reportModalDisplay = 'block';
    }
    else
      this.authService.setLaunchLogin({"action":"Report Deal"});
  }
  
  onSubmitReport(){
    if(this.reportText != "" && this.reportText != undefined && this.reportText != null){ 
      const report = {
        dealId: this.deal._id, 
        reportText: this.reportText
      };

      if(confirm("Are you sure to report deal?")) {
        this.isLoading = true;  
        this.dealService.reportDeal(report).subscribe(
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

  onShowReviewModel(){
    this.reviewForm.setValue({
      reviewTitle: '',
      reviewText: '',
      reviewRating :null
    }); 
    this.reviewRating = null;
    this.reviewModalDisplay = 'block';
  }

  onRatingClick(reviewRating){
    this.reviewRating = reviewRating;
    this.setControlValue('reviewRating',reviewRating);
  }

  get f() { return this.reviewForm.controls; }  

  onSubmitReview(){
    this.submitted = true;
    // console.log(this.f);
    if (!this.reviewForm.valid) {
      return;
    }

    const review = {
      dealId :this.deal._id,
      reviewTitle:this.reviewForm.value.reviewTitle,
      reviewText:this.reviewForm.value.reviewText,
      reviewRating:this.reviewForm.value.reviewRating
    }

    if(confirm("Are you sure to submit review?")) {
      this.isLoading = true; 
      this.reviewService.addReview(review).subscribe(
        resData => {
          //console.log(resData);
          this.submitted = false;   
          this.reviewModalDisplay = 'none';
          this.initializeForm();   
          this.reviewForm.reset();
          this.isLoading = false; 
          this.toastrService.success("Review Submitted Successfully");
          this.router.navigate([`${environment.dealsBaseUrl}/${this.deal?.dealLink}`]);
        },
        errorMessage => {
          this.isLoading = false; 
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }

  setControlValue(cName, value){
    this.f[cName].setValue(value);
  }

  getControlValue(cName){
    return this.f[cName].value;
  }
  
  private initializeForm() {
    this.reviewForm = this.formBuilder.group({
      reviewTitle: ['', [Validators.required]],
      reviewText: ['', [Validators.required]],
      reviewRating: [null, [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.questionSub){
      this.questionSub.unsubscribe();
    }
    if(this.reviewSub){
      this.reviewSub.unsubscribe();
    } 
    if(this.itemSub){
      this.itemSub.unsubscribe();
    }    
  }
}
