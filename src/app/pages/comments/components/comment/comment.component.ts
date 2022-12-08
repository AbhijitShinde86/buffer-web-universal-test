import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
;
import { AuthService } from 'src/app/auth/auth.service';

import { User } from 'src/app/auth/user.model';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { CommentsService } from '../../../../services/comments.service';
import { ActiveCommentInterface } from '../../types/activeComment.interface';
import { ActiveCommentTypeEnum } from '../../types/activeCommentType.enum';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
})
export class CommentComponent implements OnInit {
  @Input() comment;
  @Input() activeComment!: ActiveCommentInterface | null;
  @Input() replies = []; 
  @Input() currentUser!: User;
  @Input() parentId!: string | null;
  @Input() currentStartupId!: string;
  @Input() isVendor!: Boolean;
  @Input() startupUserId!:string;

  @Output()
  setActiveComment = new EventEmitter<ActiveCommentInterface | null>();
 
  commentAt: string = '';
  canReply: boolean = false; canLike: boolean = false;
  activeCommentType = ActiveCommentTypeEnum;
  replyId: string | null = null;

  isLoading = false; 

  constructor(private commentsService: CommentsService, private authService :AuthService,
    private toastrService:ShowToasterService
  ){}
  
  ngOnInit(): void {
    // console.log("comment : ", this.comment)
    this.getReplies(); 
    // console.log(`commentText - ${this.comment.commentText} : currentUser - ${this.currentUser?.id} : userId ${this.comment?.userId} : ${this.currentUser?.id==this.comment?.userId}`)
    this.commentAt = moment(this.comment.commentAt).format('DD-MM-YYYY');
    this.canReply = this.currentUser ? !Boolean(this.currentUser?.id==this.comment?.userId) && this.comment.commentStatus == 'apv' : false;
    // this.canLike = this.currentUser ? !Boolean(this.currentUser?.id==this.comment?.userId) && this.comment.commentStatus == 'apv' : false;
    this.canLike = this.comment.commentStatus == 'apv';
    this.replyId = this.comment._id;
    this.parentId = this.comment.parentId;
  }

  getReplies() {
    this.commentsService.getCommentReplies(this.comment._id, this.startupUserId).subscribe(
      res => {
        this.replies = res.data;
        this.isLoading = false;
    },
    errorMessage => { this.isLoading = false; }
    ); 

  }

  isReplying(): boolean {
    if (!this.activeComment) {
      return false;
    }
    return (
      this.activeComment.id === this.comment._id &&
      this.activeComment.type === this.activeCommentType.replying
    );
  }

  onLikeClick(){
    if(this.canLike){
      if(this.currentUser){
        if(this.comment.userLikeCount == 0){
          this.commentsService.addCommentLike(this.comment._id).subscribe(
            resData => {
              this.updateCommentLike('add');
            },
            errorMessage => {}  
          );
        }else{
          this.commentsService.removeCommentLike(this.comment._id).subscribe(
            resData => {
              this.updateCommentLike('remove');
            },
            errorMessage => {}  
          );
        }
      }
      else
        this.authService.setLaunchLogin({"action":"Commet Like"});
    }
  }

  updateCommentLike(action:string){
    this.comment.userLikeCount = this.comment.userLikeCount == 0 ? 1 : 0;
    this.comment.likeCount = action == 'add' ? (this.comment.likeCount + 1) : (this.comment.likeCount - 1); 
  }


  addReply(commentText){
    // console.log(this.currentStartupId, "  :  ", this.startupUserId)
    if(commentText != "" && commentText != undefined && commentText != null){   
      const comment = {
        startupId: this.currentStartupId, 
        commentText: commentText, 
        parentId: this.replyId,
        startupUserId: this.startupUserId
      }
      // console.log("addReply : ", comment);
      if(confirm("Are you sure reply comment?")) {
        this.isLoading = true;  
        this.commentsService.addComment(comment).subscribe(
          resData => {
            //console.log(resData);
            this.getReplies();
            this.activeComment = null;
            this.isLoading = false; ;     
            this.toastrService.success("Reply posted successfully");    
            this.setActiveComment.emit(null)   
          },
          errorMessage => {
            this.isLoading = false; ;          
            this.toastrService.error(errorMessage);
          }  
        );
      }
    }
  }

  onApproveComment(commentId){
    if(commentId == "" || commentId == null || commentId == undefined)
      return;

    if(confirm("Are you sure to approve comment?")) {
      this.commentsService.approveComment(commentId).subscribe(
        resData => {
          //console.log(resData);
          this.toastrService.success("User comment approved successfully");
        },
        errorMessage => {
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }
  
  onFlagComment(commentId){
    if(commentId == "" || commentId == null || commentId == undefined)
      return;

    if(confirm("Are you sure to flag comment?")) {
      this.commentsService.flagComment(commentId).subscribe(
        resData => {
          //console.log(resData);
          this.toastrService.success("User comment flagged successfully");
        },
        errorMessage => {
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }
}
