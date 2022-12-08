import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class FeedbacksService {
    feedback = new BehaviorSubject<string>(null);

    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    getStartUpFeedbacks(startupId:string, startupUserId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-home/getStartUpFeedbacks/${startupId}?startupUserId=${startupUserId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }
    
    getFeedbackReplies(feedbackId:string, startupUserId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-home/getFeedbackReplies/${feedbackId}?startupUserId=${startupUserId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    approveFeedback(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-startup/approveFeedback/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            this.feedback.next('feedback_approved');
            return resData;
          })
        );
    }
    
    addFeedbackLike(feedbackId:any){
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-like/addFeedbackLike`,{ feedbackId:feedbackId })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    removeFeedbackLike(feedbackId:any){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-like/removeFeedbackLike/${feedbackId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    addFeedbackReply(feedback:any){
        // console.log(feedback)
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-startup/addFeedbackReply`,{
                startupId: feedback.startupId,
                feedbackId: feedback.feedbackId, 
                feedbackReplyText: feedback.feedbackReplyText,
                startupUserId: feedback.startupUserId
            })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { 
                this.feedback.next('feedback_reply_added');
                return resData; 
            })
        );
    }

    approveFeedbackReply(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-startup/approveFeedbackReply/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            this.feedback.next('feedback_reply_approved');
            return resData;
          })
        );
    }

    
    addFeedbackReplyLike(feedbackReplyId:any){
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-like/addFeedbackReplyLike`,{ feedbackReplyId:feedbackReplyId })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    removeFeedbackReplyLike(feedbackReplyId:any){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-like/removeFeedbackReplyLike/${feedbackReplyId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

}
