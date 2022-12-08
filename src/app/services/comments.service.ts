import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class CommentsService {
    comment = new BehaviorSubject<string>(null);

    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    getStartUpComments(startupId:string, startupUserId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-home/getStartUpComments/${startupId}?startupUserId=${startupUserId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getCommentReplies(commentId:string, startupUserId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-home/getCommentReplies/${commentId}?startupUserId=${startupUserId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    addComment(comment:any){
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-comment`,{
                startupId: comment.startupId, 
                commentText: comment.commentText, 
                parentId: comment.parentId,
                startupUserId: comment.startupUserId
            })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { 
                this.comment.next('comment_added');
                return resData; 
            })
        );
    }

    addCommentLike(commentId:any){
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-like/addCommentLike`,{ commentId:commentId })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    removeCommentLike(commentId:any){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-like/removeCommentLike/${commentId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    approveComment(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-comment/approveComment/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            this.comment.next('comment_approved');
            return resData;
          })
        );
    }
    
    flagComment(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-comment/flagComment/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            this.comment.next('comment_flagged');
            return resData;
          })
        );
    }
}
