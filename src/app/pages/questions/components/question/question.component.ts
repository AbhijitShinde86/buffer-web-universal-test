import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
;
import { AuthService } from 'src/app/auth/auth.service';

import { User } from 'src/app/auth/user.model';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { QuestionsService } from '../../../../services/questions.service';
import { ActiveQuestionInterface } from '../../types/activeQuestion.interface';
import { ActiveQuestionTypeEnum } from '../../types/activeQuestionType.enum';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styles: [
  ]
})
export class QuestionComponent implements OnInit {
  @Input() question;
  @Input() activeQuestion!: ActiveQuestionInterface | null;
  @Input() replies = []; 
  @Input() currentUser!: User;
  @Input() parentId!: string | null;
  @Input() currentDealId!: string;
  @Input() isVendor!: Boolean;
  @Input() dealUserId!:string;

  @Output()
  setActiveQuestion = new EventEmitter<ActiveQuestionInterface | null>();
 
  questionAt: string = '';
  canReply: boolean = false; canLike: boolean = false;
  activeQuestionType = ActiveQuestionTypeEnum;
  replyId: string | null = null;

  isLoading = false; 

  constructor(private questionsService: QuestionsService, private authService :AuthService,
    private toastrService:ShowToasterService
  ){}
  
  ngOnInit(): void {
    // console.log("question : ", this.question)
    this.getReplies(); 
    // console.log(`question - ${this.question.question} : currentUser - ${this.currentUser?.id} : userId ${this.question?.userId} : ${this.currentUser?.id==this.question?.userId}`)
    this.questionAt = moment(this.question.questionAt).format('DD-MM-YYYY');
    this.canReply = this.currentUser ? !Boolean(this.currentUser?.id==this.question?.userId) && this.question.status == 'apv' : false;
    // this.canLike = this.currentUser ? !Boolean(this.currentUser?.id==this.question?.userId) && this.question.status == 'apv' : false;
    this.canLike = this.question.status == 'apv';
    this.replyId = this.question._id;
    this.parentId = this.question.parentId;
  }

  getReplies() {
    this.questionsService.getQuestionReplies(this.question._id, this.dealUserId).subscribe(
      res => {
        this.replies = res.data;
        this.isLoading = false;
        // console.log("replies : ",this.question._id, " - ", this.replies);
    },
    errorMessage => { this.isLoading = false; }
    ); 

  }

  isReplying(): boolean {
    if (!this.activeQuestion) {
      return false;
    }
    return (
      this.activeQuestion.id === this.question._id &&
      this.activeQuestion.type === this.activeQuestionType.replying
    );
  }

  onLikeClick(){
    if(this.canLike){
      if(this.currentUser){
        if(this.question.userLikeCount == 0){
          this.questionsService.addQuestionLike(this.question._id).subscribe(
            resData => {
              this.updateQuestionLike('add');
            },
            errorMessage => {}  
          );
        }else{
          this.questionsService.removeQuestionLike(this.question._id).subscribe(
            resData => {
              this.updateQuestionLike('remove');
            },
            errorMessage => {}  
          );
        }
      }
      else
        this.authService.setLaunchLogin({"action":"Question Like"});
    }
  }

  updateQuestionLike(action:string){
    this.question.userLikeCount = this.question.userLikeCount == 0 ? 1 : 0;
    this.question.likeCount = action == 'add' ? (this.question.likeCount + 1) : (this.question.likeCount - 1); 
  }


  addReply(question){
    // console.log(this.currentDealId, "  :  ", this.dealUserId)
    if(question != "" && question != undefined && question != null){   
      const questionData = {
        dealId: this.currentDealId, 
        question: question, 
        parentId: this.replyId,
        dealUserId: this.dealUserId
      }
      // console.log("addReply : ", question);
      if(confirm("Are you sure reply question?")) {
        this.isLoading = true;  
        this.questionsService.addQuestion(questionData).subscribe(
          resData => {
            //console.log(resData);
            this.getReplies();
            this.activeQuestion = null;
            this.isLoading = false; ;     
            this.toastrService.success("Reply posted successfully");    
            this.setActiveQuestion.emit(null)   
          },
          errorMessage => {
            this.isLoading = false; ;          
            this.toastrService.error(errorMessage);
          }  
        );
      }
    }
  }

  onApproveQuestion(questionId){
    if(questionId == "" || questionId == null || questionId == undefined)
      return;

    if(confirm("Are you sure to approve question?")) {
      this.questionsService.approveQuestion(questionId).subscribe(
        resData => {
          //console.log(resData);
          this.toastrService.success("User question approved successfully");
        },
        errorMessage => {
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }
}
