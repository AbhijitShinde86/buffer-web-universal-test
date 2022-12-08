import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class VendorService {
  
    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    getStartupCount(){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-vendor/getStartupCount`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getVendorHomeData(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-vendor/getVendorHomeData/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    deleteProduct(id:string, endpointName:string){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-vendor/${endpointName}/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }


    getStartupData(startupLink:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-vendor/getStartupData/${startupLink}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getDealData(dealLink:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-vendor/getDealData/${dealLink}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }
    
    getDealOrderData(dealId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-vendor/getDealOrderData/${dealId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }
    
    getRequests(startupId:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-vendor/getRequests/${startupId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    getRequest(id:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-vendor/getRequest/${id}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    acceptRequest(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-vendor/acceptRequest/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }
    
    declineRequest(id:any){
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-vendor/declineRequest/${id}`,null) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }

    
    // getVendorProducts(id:string){
    //     return this.http
    //     .get<Response>(
    //         `${environment.serverApiURL}/web-vendor/getProducts/${id}`)
    //     .pipe(
    //         catchError(this.handleErrorService.handleError),
    //         tap(resData => {
    //             // console.log(resData);
    //             return resData;
    //         })
    //     );
    // }
}
