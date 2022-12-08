import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class StartupService {
  
    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    getMarkets(){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-home/getMarkets`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                // console.log(resData);
                return resData;
            })
        );
    }

    addStartup(startup:any){
        // console.log("startup : ",startup);
        const formData = new FormData();
        formData.append('productName', startup.productName);
        formData.append('shortDesc', startup.shortDesc);
        formData.append('websiteUrl', startup.websiteUrl);
        formData.append('description', startup.description);
        formData.append('prodcutStatus', startup.prodcutStatus);   
        formData.append('markets', startup.markets);
        formData.append('offers', startup.offers);
        formData.append('founderNote', startup.founderNote);
        formData.append('facebookUrl', startup.facebookUrl);
        formData.append('twitterUrl', startup.twitterUrl);
        formData.append('linkedinUrl', startup.linkedinUrl);

        for (var i = 0; i < startup.images?.length; i++) {
            formData.append("images[]", startup.images[i].file, startup.images[i].name);
        }    
        
        return this.http
        .post<Response>(`${environment.serverApiURL}/web-startup`,formData) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }

    updateStartup(id:string, startup:any, oldImages:any){
        // console.log("startup : ",startup);
        const formData = new FormData();
        formData.append('productName', startup.productName);
        formData.append('shortDesc', startup.shortDesc);
        formData.append('websiteUrl', startup.websiteUrl);
        formData.append('description', startup.description);
        formData.append('prodcutStatus', startup.prodcutStatus);   
        formData.append('markets', startup.markets);
        formData.append('offers', startup.offers);
        formData.append('founderNote', startup.founderNote);
        formData.append('facebookUrl', startup.facebookUrl);
        formData.append('twitterUrl', startup.twitterUrl);
        formData.append('linkedinUrl', startup.linkedinUrl);
        formData.append('imagePaths', startup.imagePaths);

        for (var i = 0; i < startup.images?.length; i++) {
            formData.append("images[]", startup.images[i].file, startup.images[i].name);
        }    
        formData.append("oldImages",JSON.stringify(oldImages));
        
        return this.http
        .put<Response>(`${environment.serverApiURL}/web-startup/${id}`,formData) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }

    getJoinBetaData(){
      return this.http
      .get<Response>(
          `${environment.serverApiURL}/web-startup/getJoinBetaData`)
      .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
              // console.log(resData);
              return resData;
          })
      );
    }

    joinBeta(request:any){
        return this.http
        .post<Response>(`${environment.serverApiURL}/web-startup/joinBeta`,request) 
        .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
            return resData;
          })
        );
    }

    joinBetaAdmin(request:any){
      return this.http
      .post<Response>(`${environment.serverApiURL}/web-startup/joinBetaAdmin`,request) 
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
    }

    reportStartup(report:any){
      return this.http
      .post<Response>(`${environment.serverApiURL}/web-startup/reportStartup`, report) 
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
    }

    addFeedback(feedback:any){
      return this.http
      .post<Response>(`${environment.serverApiURL}/web-startup/feedbackStartup`, feedback) 
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
    }
}
