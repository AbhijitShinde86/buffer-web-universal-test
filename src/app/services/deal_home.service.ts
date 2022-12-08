import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class DealHomeService{
    
    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    getDealList(pageNo, size){ 
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-deal-home/getDealList?pageNo=${pageNo}&size=${size}`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    return resData;
                })
            );
    }    

    getDealByLink(link:string){
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-deal-home/getDealByLink/${link}`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    // console.log(resData);
                    return resData;
                })
            );
            
    }
}