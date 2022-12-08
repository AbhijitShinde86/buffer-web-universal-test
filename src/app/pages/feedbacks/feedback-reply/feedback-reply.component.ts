import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
;
import { User } from 'src/app/auth/user.model';
import { FeedbacksService } from 'src/app/services/feedbacks.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';

@Component({
  selector: 'feedback-reply',
  templateUrl: './feedback-reply.component.html',
  styles: [
  ]
})
export class FeedbackReplyComponent implements OnInit {
  @Input() reply;
  @Input() isVendor!: Boolean;
  @Input() currentUser!: User;

  replyAt: string = ''; canLike: boolean = false;

  constructor(private feedbacksService: FeedbacksService,
    private toastrService:ShowToasterService) { }

  ngOnInit(): void {
    // console.log(this.reply);
    this.replyAt = moment(this.reply.feedbackAt).format('DD-MM-YYYY');
    this.canLike = this.currentUser ? !Boolean(this.currentUser?.id==this.reply?.userId) && this.reply.feedbackReplyStatus == 'apv' : false;
    
  }

  onApproveFeedbackReply(feedbackReplyId){
    if(feedbackReplyId == "" || feedbackReplyId == null || feedbackReplyId == undefined)
      return;

    if(confirm("Are you sure to approve feedback reply?")) {
      this.feedbacksService.approveFeedbackReply(feedbackReplyId).subscribe(
        resData => {
          //console.log(resData);
          this.toastrService.success("User feedback reply approved successfully");
        },
        errorMessage => {
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }

  onFeedbackReplyLikeClick(){
    if(this.canLike){
      if(this.reply.userLikeCount == 0){
        this.feedbacksService.addFeedbackReplyLike(this.reply._id).subscribe(
          resData => {
            this.updateFeedbackReplyLike('add');
          },
          errorMessage => {}  
        );
      }else{
        this.feedbacksService.removeFeedbackReplyLike(this.reply._id).subscribe(
          resData => {
            this.updateFeedbackReplyLike('remove');
          },
          errorMessage => {}  
        );
      }
    }
  }

  updateFeedbackReplyLike(action:string){
    this.reply.userLikeCount = this.reply.userLikeCount == 0 ? 1 : 0;
    this.reply.likeCount = action == 'add' ? (this.reply.likeCount + 1) : (this.reply.likeCount - 1); 
  }
}
