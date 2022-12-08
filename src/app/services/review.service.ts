import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class ReviewService {
    review = new BehaviorSubject<string>(null);

    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    getReviews(dealId:string, dealUserId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-deal-home/getReviews/${dealId}?dealUserId=${dealUserId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }
    
    getReviewReplies(reviewId:string, dealUserId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-deal-home/getReviewReplies/${reviewId}?dealUserId=${dealUserId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    addReview(review:any){
        return this.http
        .post<Response>(`${environment.serverApiURL}/web-deal-review/reviewDeal`, review) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }
  
    approveReview(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-deal-review/approveReview/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            this.review.next('review_approved');
            return resData;
          })
        );
    }
    
    addReviewReply(review:any){
        // console.log(review)
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-deal-review/addReviewReply`,{
                dealId: review.dealId,
                dealReviewId: review.reviewId, 
                reviewReplyText: review.reviewReplyText,
                dealUserId: review.dealUserId
            })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { 
                this.review.next('review_reply_added');
                return resData; 
            })
        );
    }

    approveReviewReply(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-deal-review/approveReviewReply/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            this.review.next('review_reply_approved');
            return resData;
          })
        );
    }

    addReviewLike(reviewId:any){
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-deal-review/addReviewLike`,{ reviewId:reviewId })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    removeReviewLike(reviewId:any){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-deal-review/removeReviewLike/${reviewId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }
    
    addReviewReplyLike(reviewReplyId:any){
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-deal-review/addReviewReplyLike`,{ reviewReplyId:reviewReplyId })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    removeReviewReplyLike(reviewReplyId:any){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-deal-review/removeReviewReplyLike/${reviewReplyId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }
}
