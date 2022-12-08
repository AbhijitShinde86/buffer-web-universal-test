import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class DealService {
  
    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    
    addDealRequest(deal:any){
      const dealData = {
        dealName: deal.dealName,
        shortDesc: deal.shortDesc,
        websiteUrl: deal.websiteUrl,
        description: deal.description,        
        facebookUrl: deal.facebookUrl,
        twitterUrl: deal.twitterUrl,
        linkedinUrl: deal.linkedinUrl,
      };

      return this.http
      .post<Response>(`${environment.serverApiURL}/web-deal/addDealRequest`, dealData) 
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  getDealRequestByLink(link:string){
    return this.http
      .get<Response>(
          `${environment.serverApiURL}/web-deal/getDealRequestByLink/${link}`)
      .pipe(
          catchError(this.handleErrorService.handleError),
          tap(resData => {
              // console.log(resData);
              return resData;
          })
      );        
  }

  addDealContent(dealRequestId:string, deal:any){
    const formData = new FormData();
    formData.append('dealRequestId', dealRequestId);
    
    formData.append('emailAddress', deal.emailAddress);
    formData.append('productName', deal.productName);
    formData.append('pronunciation', deal.pronunciation);
    formData.append('productUrl', deal.productUrl);   
    formData.append('pricingUrl', deal.pricingUrl);
    formData.append('palnReady', deal.palnReady);

    formData.append('isProductGDPR', deal.isProductGDPR);
    formData.append('productMultiLang', deal.productMultiLang);

    formData.append('shortDesc', deal.shortDesc);
    formData.append('header', deal.header);
    formData.append('subHeader', deal.subHeader);
    formData.append('productSEOText', deal.productSEOText);

    formData.append('isLogoMatch', deal.isLogoMatch);
    formData.append('isLogoConfirm', deal.isLogoConfirm);

    formData.append('introduction', deal.introduction);
    formData.append('taxonomy', deal.taxonomy);
    formData.append('solutions', deal.solutions);

    formData.append('description', deal.description);
    formData.append('useCases', deal.useCases);
    formData.append('features', deal.features);
    formData.append('targetCustomer', deal.targetCustomer);
    
    for (var i = 0; i < deal.headerImages?.length; i++) {
      formData.append("images[]", deal.headerImages[i].file, "headerFile");// deal.headerImages[i].name, );
    } 
    for (var i = 0; i < deal.horizontalImages?.length; i++) {
      formData.append("images[]", deal.horizontalImages[i].file, "horizontalFile");
    }   
    for (var i = 0; i < deal.images?.length; i++) {
        formData.append("images[]", deal.images[i].file, "productFile");
    }    
    
    return this.http
    .post<Response>(`${environment.serverApiURL}/web-deal/addDealContent`,formData) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }
      
  reportDeal(report:any){
    return this.http
    .post<Response>(`${environment.serverApiURL}/web-deal/reportDeal`, report) 
    .pipe(
      catchError(this.handleErrorService.handleError),
      tap(resData => {
        return resData;
      })
    );
  }
}
