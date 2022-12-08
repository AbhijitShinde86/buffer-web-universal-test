import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
;
import { AuthService } from 'src/app/auth/auth.service';

import { User } from 'src/app/auth/user.model';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { ReviewService } from '../../../services/review.service';
import { ActiveReviewInterface } from '../types/activeReview.interface';
import { ActiveReviewTypeEnum } from '../types/activeReviewType.enum';


@Component({
  selector: 'review',
  templateUrl: './review.component.html',
  styles: [
  ]
})
export class ReviewComponent implements OnInit {
  @Input() review;
  @Input() activeReview!: ActiveReviewInterface | null;
  @Input() replies = []; 
  @Input() currentUser!: User;
  @Input() parentId!: string | null;
  @Input() currentDealId!: string;
  @Input() isVendor!: Boolean;
  @Input() dealUserId!:string;

  @Output()
  setActiveReview = new EventEmitter<ActiveReviewInterface | null>();
 
  reviewAt: string = '';
  canReply: boolean = false; canLike: boolean = false;
  activeReviewType = ActiveReviewTypeEnum;
  replyId: string | null = null;

  isLoading = false;

  constructor(private reviewsService: ReviewService, private authService :AuthService,
    private toastrService:ShowToasterService
  ){}
  
  ngOnInit(): void {
    // console.log("review : ", this.review)
    this.getReplies(); 
    // console.log(`reviewText - ${this.review.reviewText} : currentUser - ${this.currentUser?.id} : userId ${this.review?.userId} : ${this.currentUser?.id==this.review?.userId}`)
    this.reviewAt = moment(this.review.reviewAt).format('DD-MM-YYYY');
    this.canReply = this.currentUser ? !Boolean(this.currentUser?.id==this.review?.userId) && this.review.reviewStatus == 'apv' : false;
    // this.canLike = this.currentUser ? !Boolean(this.currentUser?.id==this.review?.userId) && this.review.reviewStatus == 'apv' : false;
    this.canLike = this.review.reviewStatus == 'apv';
    this.replyId = this.review._id;
    this.parentId = this.review.parentId;
  }

  getReplies() {
    this.reviewsService.getReviewReplies(this.review._id, this.dealUserId).subscribe(
      res => {
        this.replies = res.data;
        this.isLoading = false;
    },
    errorMessage => { this.isLoading = false; }
    ); 

  }

  isReplying(): boolean {
    if (!this.activeReview) {
      return false;
    }
    return (
      this.activeReview.id === this.review._id &&
      this.activeReview.type === this.activeReviewType.replying
    );
  }
  
  onLikeClick(){
    if(this.canLike){
      if(this.currentUser){
        if(this.review.userLikeCount == 0){
          this.reviewsService.addReviewLike(this.review._id).subscribe(
            resData => {
              this.updateReviewLike('add');
            },
            errorMessage => {}  
          );
        }else{
          this.reviewsService.removeReviewLike(this.review._id).subscribe(
            resData => {
              this.updateReviewLike('remove');
            },
            errorMessage => {}  
          );
        }
      }
      else
        this.authService.setLaunchLogin({"action":"Review Like"});
    }
  }

  updateReviewLike(action:string){
    this.review.userLikeCount = this.review.userLikeCount == 0 ? 1 : 0;
    this.review.likeCount = action == 'add' ? (this.review.likeCount + 1) : (this.review.likeCount - 1); 
  }


  addReply(reviewReplyText){
    // console.log(this.currentDealId, "  :  ", this.dealUserId)
    if(reviewReplyText != "" && reviewReplyText != undefined && reviewReplyText != null){   
      const review = {
        dealId: this.currentDealId, 
        reviewId: this.review._id,
        reviewReplyText: reviewReplyText, 
        dealUserId: this.dealUserId
      }
      // console.log("addReply : ", review);
      if(confirm("Are you sure reply review?")) {
        this.isLoading = true;  
        this.reviewsService.addReviewReply(review).subscribe(
          resData => {
            //console.log(resData);
            this.getReplies();
            this.activeReview = null;
            this.isLoading = false; ;     
            this.toastrService.success("Reply posted successfully");    
            this.setActiveReview.emit(null)   
          },
          errorMessage => {
            this.isLoading = false; ;          
            this.toastrService.error(errorMessage);
          }  
        );
      }
    }
  }

  onApproveReview(reviewId){
    if(reviewId == "" || reviewId == null || reviewId == undefined)
      return;

    if(confirm("Are you sure to approve review?")) {
      this.reviewsService.approveReview(reviewId).subscribe(
        resData => {
          //console.log(resData);
          this.toastrService.success("User review approved successfully");
        },
        errorMessage => {
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }
}
