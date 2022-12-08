import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class UserService {
  
    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    getUserForDashboard(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/getUserForDashboard/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getUser(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    updateUser(id, user:any,isDeleteImage:boolean){
        const formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('username', user.username);        
        formData.append('companyName', user.companyName);
        formData.append('companyWebsite', user.companyWebsite);
        formData.append('photoUrl', user.photoUrl);
        formData.append('isDeleteImage', isDeleteImage.toString());

        for (var i = 0; i < user.images?.length; i++) {
            formData.append("images[]", user.images[i].file, user.images[i].name);
        }        
        
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-user/${id}`,formData) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }
    
    getUserBetaProfile(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/getUserBetaProfile/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    updateUserBetaProfile(id:string, betaProfile:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-user/updateUserBetaProfile/${id}`,betaProfile) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }
    
    redeemGiftCard(giftCardNo:string){
        return this.http
        .post<Response>(`${environment.serverApiURL}/web-user/redeemGiftCard`,{giftCardNo}) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }
    
    getJoinProducts(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/getJoinProducts/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }
    
    getNotifications(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/getNotifications/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }
    
    removeNotification(id:any, userId:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-user/removeNotification/${id}`,{
            userId : userId
        }) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }

    deleteAccount(id:string){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-user/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }
    
    getUserByUsername(username:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user-public/getUserByUsername/${username}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getProducts(username:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user-public/getProducts/${username}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getLikedProducts(username:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user-public/getLikedProducts/${username}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getBadges(username:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user-public/getBadges/${username}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }
    
    getOrders(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/getOrders/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getOrder(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/getOrder/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getDealOrders(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/getDealOrders/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getDealOrderByLink(link:string, orderId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-user/getDealOrderByLink/${link}?orderId=${orderId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );            
    }
}
