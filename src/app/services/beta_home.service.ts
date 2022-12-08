import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Response } from '../app.component'
import { HandleErrorService } from "../shared/error-handle.service";

@Injectable({providedIn:'root'})
export class BetaHomeService{
    
    constructor(private http : HttpClient,
        private handleErrorService: HandleErrorService){}

    
    
    getDisplayCategories(){
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getDisplayCategories`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    // console.log(resData);
                    return resData;
                })
            );
    }
    
    getCategoriesList(){
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getCategoriesList`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    // console.log(resData);
                    return resData;
                })
            );
    }
    
    // getStartUpList(){ 
    //     return this.http
    //         .get<Response>(
    //             `${environment.serverApiURL}/web-home/getStartUpList`)
    //         .pipe(
    //             catchError(this.handleErrorService.handleError),
    //             tap(resData => {
    //                 return resData;
    //             })
    //         );
    // }    
    
    getHomeStartUps(){ 
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getHomeStartUps`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    return resData;
                })
            );
    }    

    getDefaultStartUpList(pageNo, size){ 
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getDefaultStartUpList?pageNo=${pageNo}&size=${size}`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    return resData;
                })
            );
    }    

    getStartUps(pageNo, size){ 
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getStartUps?pageNo=${pageNo}&size=${size}`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    return resData;
                })
            );
    }    


    getStartUpByLink(link:string){
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getStartUpByLink/${link}`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    //console.log(resData);
                    return resData;
                })
            );
    }
    
    getStartUpPreviewByLink(link:string, userType:string){
        return this.http
        .get<Response>(
            `${environment.serverApiURL}/web-home/getStartUpPreviewByLink/${link}?userType=${userType}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => {
                //console.log(resData);
                return resData;
            })
        );
    }
    

    addStartupLike(startupId:any){
        return this.http
        .post<Response>(
            `${environment.serverApiURL}/web-like/addStartupLike`,{ startupId:startupId })
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    removeStartupLike(startupId:any){
        return this.http
        .delete<Response>(
            `${environment.serverApiURL}/web-like/removeStartupLike/${startupId}`)
        .pipe(
            catchError(this.handleErrorService.handleError),
            tap(resData => { return resData; })
        );
    }

    
    getCategories(){
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getCategories`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    // console.log(resData);
                    return resData;
                })
            );
    }

    getCategoryByLink(link:string){
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getCategoryByLink/${link}`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    //console.log(resData);
                    return resData;
                })
            );
            
    }
    
    getCategoryStartUpList(id:string,pageNo, size){
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getCategoryStartUpList/${id}?pageNo=${pageNo}&size=${size}`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    //console.log(resData);
                    return resData;
                })
            );
            
    }

    getSearchList(searchText:string){
        return this.http
            .get<Response>(
                `${environment.serverApiURL}/web-home/getSearchList/${searchText}`)
            .pipe(
                catchError(this.handleErrorService.handleError),
                tap(resData => {
                    //console.log(resData);
                    return resData;
                })
        );
            
    }
}