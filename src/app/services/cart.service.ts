import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class CartService {
  
  constructor(private http : HttpClient,
      private handleErrorService: HandleErrorService){}

  getCountryList(){
      return this.http
      .get<Response>(
          `${environment.serverApiURL}/web-deal-cart/getCountryList`)
      .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
              // console.log(resData);
              return resData;
          })
      );
  }    
      

  getCart(){
      return this.http
      .get<Response>(
          `${environment.serverApiURL}/web-deal-cart/getCart`)
      .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
              // console.log(resData);
              return resData;
          })
      );
  }    
  
  getCartUser(){
    return this.http
    .get<Response>(
        `${environment.serverApiURL}/web-deal-cart/getCartUser`)
    .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
            // console.log(resData);
            return resData;
        })
    );
  }   

  addDealToCart(deal:any){
      return this.http
      .post<Response>(`${environment.serverApiURL}/web-deal-cart`, deal) 
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
  }
  
  updateQuantity(id:any, quantity: Number){
      return this.http
      .put<Response>(`${environment.serverApiURL}/web-deal-cart/updateQuantity/${id}`,{
          quantity:quantity
      }) 
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  updatePlan(id:any, planId: String){
    return this.http
    .put<Response>(`${environment.serverApiURL}/web-deal-cart/updatePlan/${id}`,{
        planId:planId
    }) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  updateCountry(userId:any, countryData: any){
    return this.http
    .put<Response>(`${environment.serverApiURL}/web-deal-cart/updateCountry`,{
      countryId:countryData._id, 
      countryCode2D:countryData.countryCode2D, 
      currencyCode:countryData.currencyCode
    }) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }
  
  deletCartDeal(id:any){
    return this.http
    .delete<Response>(
        `${environment.serverApiURL}/web-deal-cart/${id}`)
    .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => { return resData; })
    );
  }

  getCards(){
      return this.http
      .get<Response>(
          `${environment.serverApiURL}/web-deal-cart/getCards`)
      .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
              // console.log(resData);
              return resData;
          })
      );
  }    
  
  addCard(card:any){
      return this.http
      .post<Response>(`${environment.serverApiURL}/web-deal-cart/addCard`, card) 
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
  }
  
  deleteCard(cardId:string){
      return this.http
      .delete<Response>(
          `${environment.serverApiURL}/web-deal-cart/deleteCard/${cardId}`)
      .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => { return resData; })
      );
  }
  
  placeOrder(orderRequest:any){
    return this.http
    .post<Response>(`${environment.serverApiURL}/web-deal-cart/placeOrder`, orderRequest) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  createPaymentIntent(order:any){
    return this.http
    .post<Response>(`${environment.serverApiURL}/web-deal-cart/createPaymentIntent`, order) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  setPaymentCompleted(id:any){
    return this.http
    .put<Response>(`${environment.serverApiURL}/web-deal-cart/setPaymentCompleted/${id}`,{}) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  createOrder(orderRequest:any){
    return this.http
    .post<Response>(`${environment.serverApiURL}/web-deal-cart/createOrder`, orderRequest) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  refundDeal(orderId:string, dealId:string, isFullRefund:boolean){
    return this.http
    .post<Response>(`${environment.serverApiURL}/web-deal-cart/refundDeal`, 
    {
      orderId:orderId, dealId:dealId, isFullRefund: isFullRefund
    }) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }

  applyPromo(userId:string, couponCode:string, amount: number){
    return this.http
    .post<Response>(`${environment.serverApiURL}/web-deal-cart/applyPromo`,{
        userId : userId,
        couponCode : couponCode,
        amount : amount
      })
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        //console.log(resData);
        return resData;
      })
    );
  }

  removePromo(couponTransId:any){
    return this.http
    .delete<Response>(`${environment.serverApiURL}/web-deal-cart/removePromo/${couponTransId}`)
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        //console.log(resData);
        return resData;
      })
    );
  }

  // createCheckoutSession(orderRequest:any){
  //   return this.http
  //   .post<Response>(`${environment.serverApiURL}/web-deal-cart/createCheckoutSession`, orderRequest) 
  //   .pipe(
  //     catchError(this.handleErrorService.handleError),
  //     tap(resData => {
  //       return resData;
  //     })
  //   );
  // }

  // handleCheckoutSuccess(sessionId:any, orderId: String){
  //   // console.log(sessionId , orderId);
  //   return this.http
  //   .put<Response>(`${environment.serverApiURL}/web-deal-cart/handleCheckoutSuccess/${sessionId}`,{
  //       orderId:orderId
  //   }) 
  //   .pipe(
  //     catchError(this.handleErrorService.handleError),
  //     tap(resData => {
  //       return resData;
  //     })
  //   );
  // }

  // handleCheckoutFailure(sessionId:any, orderId: String){
  //   // console.log(sessionId , orderId);
  //   return this.http
  //   .put<Response>(`${environment.serverApiURL}/web-deal-cart/handleCheckoutFailure/${sessionId}`,{
  //       orderId:orderId
  //   }) 
  //   .pipe(
  //     catchError(this.handleErrorService.handleError),
  //     tap(resData => {
  //       return resData;
  //     })
  //   );
  // }

}
