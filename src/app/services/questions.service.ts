import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class QuestionsService {
    question = new BehaviorSubject<string>(null);

    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    getDealQuestions(dealId:string, dealUserId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-deal-home/getDealQuestions/${dealId}?dealUserId=${dealUserId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getQuestionReplies(questionId:string, dealUserId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-deal-home/getQuestionReplies/${questionId}?dealUserId=${dealUserId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    addQuestion(question:any){
        // console.log(question)
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-deal-question`,{
                dealId: question.dealId, 
                question: question.question, 
                parentId: question.parentId,
                dealUserId: question.dealUserId
            })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { 
                this.question.next('question_added');
                return resData; 
            })
        );
    }

    addQuestionLike(questionId:any){
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-deal-question/addQuestionLike`,{ questionId:questionId })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    removeQuestionLike(questionId:any){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-deal-question/removeQuestionLike/${questionId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    approveQuestion(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-deal-question/approveQuestion/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            this.question.next('question_approved');
            return resData;
          })
        );
    }
}
