import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
;
import { User } from 'src/app/auth/user.model';
import { ReviewService } from 'src/app/services/review.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';

@Component({
  selector: 'review-reply',
  templateUrl: './review-reply.component.html',
  styles: [
  ]
})
export class ReviewReplyComponent implements OnInit {
  @Input() reply;
  @Input() isVendor!: Boolean;
  @Input() currentUser!: User;

  replyAt: string = ''; canLike: boolean = false;

  constructor(private reviewsService: ReviewService,
    private toastrService:ShowToasterService) { }

  ngOnInit(): void {
    // console.log(this.reply);
    this.replyAt = moment(this.reply.reviewAt).format('DD-MM-YYYY');
    this.canLike = this.currentUser ? !Boolean(this.currentUser?.id==this.reply?.userId) && this.reply.dealReviewReplyStatus == 'apv' : false;    
  }

  onApproveReviewReply(reviewReplyId){
    if(reviewReplyId == "" || reviewReplyId == null || reviewReplyId == undefined)
      return;

    if(confirm("Are you sure to approve review reply?")) {
      this.reviewsService.approveReviewReply(reviewReplyId).subscribe(
        resData => {
          //console.log(resData);
          this.toastrService.success("User review reply approved successfully");
        },
        errorMessage => {
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }

  onReviewReplyLikeClick(){
    if(this.canLike){
      if(this.reply.userLikeCount == 0){
        this.reviewsService.addReviewReplyLike(this.reply._id).subscribe(
          resData => {
            this.updateReviewReplyLike('add');
          },
          errorMessage => {}  
        );
      }else{
        this.reviewsService.removeReviewReplyLike(this.reply._id).subscribe(
          resData => {
            this.updateReviewReplyLike('remove');
          },
          errorMessage => {}  
        );
      }
    }
  }

  updateReviewReplyLike(action:string){
    this.reply.userLikeCount = this.reply.userLikeCount == 0 ? 1 : 0;
    this.reply.likeCount = action == 'add' ? (this.reply.likeCount + 1) : (this.reply.likeCount - 1); 
  }
}
