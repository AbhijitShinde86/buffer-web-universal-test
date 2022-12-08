import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
;
import { AuthService } from 'src/app/auth/auth.service';

import { User } from 'src/app/auth/user.model';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { FeedbacksService } from '../../../services/feedbacks.service';
import { ActiveFeedbackInterface } from '../types/activeFeedback.interface';
import { ActiveFeedbackTypeEnum } from '../types/activeFeedbackType.enum';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styles: [
  ]
})
export class FeedbackComponent implements OnInit {
  @Input() feedback;
  @Input() activeFeedback!: ActiveFeedbackInterface | null;
  @Input() replies = []; 
  @Input() currentUser!: User;
  @Input() parentId!: string | null;
  @Input() currentStartupId!: string;
  @Input() isVendor!: Boolean;
  @Input() startupUserId!:string;

  @Output()
  setActiveFeedback = new EventEmitter<ActiveFeedbackInterface | null>();
 
  feedbackAt: string = '';
  canReply: boolean = false; canLike: boolean = false;
  activeFeedbackType = ActiveFeedbackTypeEnum;
  replyId: string | null = null;

  isLoading = false;

  constructor(private feedbacksService: FeedbacksService, private authService :AuthService,
    private toastrService:ShowToasterService
  ){}
  
  ngOnInit(): void {
    // console.log("feedback : ", this.feedback)
    this.getReplies(); 
    // console.log(`feedbackText - ${this.feedback.feedbackText} : currentUser - ${this.currentUser?.id} : userId ${this.feedback?.userId} : ${this.currentUser?.id==this.feedback?.userId}`)
    this.feedbackAt = moment(this.feedback.feedbackAt).format('DD-MM-YYYY');
    this.canReply = this.currentUser ? !Boolean(this.currentUser?.id==this.feedback?.userId) && this.feedback.feedbackStatus == 'apv' : false;
    // this.canLike = this.currentUser ? !Boolean(this.currentUser?.id==this.feedback?.userId) && this.feedback.feedbackStatus == 'apv' : false;
    this.canLike = this.feedback.feedbackStatus == 'apv';
    this.replyId = this.feedback._id;
    this.parentId = this.feedback.parentId;
  }

  getReplies() {
    this.feedbacksService.getFeedbackReplies(this.feedback._id, this.startupUserId).subscribe(
      res => {
        this.replies = res.data;
        this.isLoading = false;
    },
    errorMessage => { this.isLoading = false; }
    ); 

  }

  isReplying(): boolean {
    if (!this.activeFeedback) {
      return false;
    }
    return (
      this.activeFeedback.id === this.feedback._id &&
      this.activeFeedback.type === this.activeFeedbackType.replying
    );
  }
  
  onLikeClick(){
    if(this.canLike){      
      if(this.currentUser){
        if(this.feedback.userLikeCount == 0){
          this.feedbacksService.addFeedbackLike(this.feedback._id).subscribe(
            resData => {
              this.updateFeedbackLike('add');
            },
            errorMessage => {}  
          );
        }else{
          this.feedbacksService.removeFeedbackLike(this.feedback._id).subscribe(
            resData => {
              this.updateFeedbackLike('remove');
            },
            errorMessage => {}  
          );
        }
      }
      else
        this.authService.setLaunchLogin({"action":"Feedback Like"});
    }
  }

  updateFeedbackLike(action:string){
    this.feedback.userLikeCount = this.feedback.userLikeCount == 0 ? 1 : 0;
    this.feedback.likeCount = action == 'add' ? (this.feedback.likeCount + 1) : (this.feedback.likeCount - 1); 
  }


  addReply(feedbackReplyText){
    // console.log(this.currentStartupId, "  :  ", this.startupUserId)
    if(feedbackReplyText != "" && feedbackReplyText != undefined && feedbackReplyText != null){   
      const feedback = {
        startupId: this.currentStartupId, 
        feedbackId: this.feedback._id,
        feedbackReplyText: feedbackReplyText, 
        startupUserId: this.startupUserId
      }
      // console.log("addReply : ", feedback);
      if(confirm("Are you sure reply feedback?")) {
        this.isLoading = true;  
        this.feedbacksService.addFeedbackReply(feedback).subscribe(
          resData => {
            //console.log(resData);
            this.getReplies();
            this.activeFeedback = null;
            this.isLoading = false; ;     
            this.toastrService.success("Reply posted successfully");    
            this.setActiveFeedback.emit(null)   
          },
          errorMessage => {
            this.isLoading = false; ;          
            this.toastrService.error(errorMessage);
          }  
        );
      }
    }
  }

  onApproveFeedback(feedbackId){
    if(feedbackId == "" || feedbackId == null || feedbackId == undefined)
      return;

    if(confirm("Are you sure to approve feedback?")) {
      this.feedbacksService.approveFeedback(feedbackId).subscribe(
        resData => {
          //console.log(resData);
          this.toastrService.success("User feedback approved successfully");
        },
        errorMessage => {
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }
}
