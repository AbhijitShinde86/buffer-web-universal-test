import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import { Response } from '../app.component'
import { environment } from 'src/environments/environment';
import { HandleErrorService } from '../shared/error-handle.service';
import { LocalstorageService } from '../services/localstorage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  launchLogin = new BehaviorSubject<User>(null);
  cartCount = new BehaviorSubject<Number>(0);

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private localstorageService: LocalstorageService,
    private handleErrorService:HandleErrorService) {}
  
  setLaunchLogin(data: any){
    // console.log(data)
    this.launchLogin.next(data);
  }

  updateCartCount(cCount: Number, user :any = null){
    if(user){
      this.localstorageService.setItem('userData', JSON.stringify(user));
    }
    this.cartCount.next(cCount);
  }
  
  getUserByEmail(email:string){
    let params = new HttpParams();
    params = params.append('email', email);
    return this.http
      .get<any>(
        `${environment.serverApiURL}/auth/getUserByEmail/email`,{ params: params })
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  signup(registerForm: any, password: string) {
    return this.http
      .post<Response>(
        `${environment.serverApiURL}/auth/signup`,
          {
            firstName: registerForm.firstName,
            lastName: registerForm.lastName,
            email: registerForm.email,
            password: password
          }
      )
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          //console.log(resData);
          return resData;
        })
      );
  }

  verifyOTP(email: string, otp: string) {
    return this.http
      .post<Response>(
        `${environment.serverApiURL}/auth/verifyOTP`,
        {
          email, otp
        }
      )
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          //console.log(resData);
          this.handleAuthentication(
            resData.data.email,
            resData.data.userId,
            resData.data.token,
            +resData.data.expiresIn,
            resData.data.name,
            resData.data.username,
            resData.data.firstName,
            resData.data.lastName,
            resData.data.photoUrl,
            +resData.data.scnt,
            +resData.data.dcnt,
            +resData.data.ccnt,
            resData.data.stripeId
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<Response>(
        `${environment.serverApiURL}/auth/login`,
        {
          email: email,
          password: password
        }
      )
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          // console.log(resData.data);
          this.handleAuthentication(
            resData.data.email,
            resData.data.userId,
            resData.data.token,
            +resData.data.expiresIn,
            resData.data.name,
            resData.data.username,
            resData.data.firstName,
            resData.data.lastName,
            resData.data.photoUrl,
            +resData.data.scnt,
            +resData.data.dcnt,
            +resData.data.ccnt,
            resData.data.stripeId
          );
        })
      );
  }

  resendOTP(email: string) {
    return this.http
      .post<Response>(
        `${environment.serverApiURL}/auth/resendOTP`,
        {
          email: email
        }
      )
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  sendForgotOTP(email: string) {
    return this.http
      .post<Response>(
        `${environment.serverApiURL}/auth/sendForgotOTP`,
        {
          email: email
        }
      )
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  resendForgotOTP(email: string) {
    return this.http
      .post<Response>(
        `${environment.serverApiURL}/auth/resendForgotOTP`,
        {
          email: email
        }
      )
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          return resData;
        })
      );
  }

  resetPassword(email: string, password: string, otp: string) {
    return this.http
      .post<Response>(
        `${environment.serverApiURL}/auth/resetPassword`,
          {
            email:email, password: password, otp
          }
      )
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          //console.log(resData);
          return resData;
        })
      );
  }

  registerOrLogin(socialUser) {
    return this.http
      .post<Response>(
        `${environment.serverApiURL}/auth/registerOrLogin`,
        {
          socialUser
        }
      )
      .pipe(
        catchError(this.handleErrorService.handleError),
        tap(resData => {
          // console.log(resData);
          this.handleAuthentication(
            resData.data.email,
            resData.data.userId,
            resData.data.token,
            +resData.data.expiresIn,
            resData.data.name,
            resData.data.username,
            resData.data.firstName,
            resData.data.lastName,
            resData.data.photoUrl,
            +resData.data.scnt,
            +resData.data.dcnt,
            +resData.data.ccnt,
            resData.data.stripeId
          );
        })
      );
  }

  // getUserDetails(userId:string){
  //   return this.http
  //   .get<any>(
  //     `${environment.serverApiURL}/web-user/getUserDetails/${userId}`)
  //   .pipe(
  //     catchError(this.handleErrorService.handleError),
  //     tap(resData => {
  //         // console.log(resData);
  //         return resData;
  //     })
  //   );
  // }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      username:string;
      _token: string;
      _tokenExpirationDate: string;
      name: string,
      firstName: string,
      lastName: string,
      photoUrl: string,
      scnt:Number,
      dcnt:Number,
      ccnt:Number,
      stripeId:string,
      isSignUpSucceed
    } = JSON.parse(this.localstorageService.getItem('userData'));
    if (!userData) {
      this.logout();
      return;
    }
    const loadedUser = new User(
      userData.id,
      userData.email,
      userData.name,
      userData.username,
      userData.firstName,
      userData.lastName,
      userData.photoUrl,
      userData.scnt,
      userData.dcnt,
      userData.ccnt,
      userData.stripeId,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.updateCartCount(userData.ccnt);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.localstorageService.removeItem('userData');
    this.user.next(null);
    this.updateCartCount(0);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  checkIsStillLogged(){
    const userData: {
      email: string;
      id: string;
      username:string;
      _token: string;
      _tokenExpirationDate: string;
      name: string,
      firstName: string,
      lastName: string,
      photoUrl: string,
      scnt:Number,
      dcnt:Number,
      ccnt:Number,
      stripeId:string,
      isSignUpSucceed
    } = JSON.parse(this.localstorageService.getItem('userData'));
    if (userData) {
      return true;
    }
    else{
      return false;
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number,
    name : string,
    username:string,
    firstName:string, lastName:string, 
    photoUrl:string, scnt:Number, 
    dcnt:Number, ccnt:Number, stripeId:string
  ) {    
    // console.log("handleAuthentication : ",email, userId, token, expiresIn, name )
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(userId, email, name, username, firstName, lastName, photoUrl, scnt, dcnt, ccnt, stripeId, token, expirationDate);
    this.user.next(user);
    this.updateCartCount(ccnt);
    this.autoLogout(expiresIn * 1000);
    this.localstorageService.setItem('userData', JSON.stringify(user));
  }

}
