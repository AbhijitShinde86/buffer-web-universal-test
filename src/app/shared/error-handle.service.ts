import { Injectable } from "@angular/core";
import {  HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CartService } from "../services/cart.service";

@Injectable({providedIn:'root'})

export class HandleErrorService{

  handleError(errorRes: HttpErrorResponse) {
      // console.log(errorRes);
      let errorMessage = 'An unknown error occurred!';
      if (!errorRes.error || !errorRes.error.status) {
        return throwError(errorMessage);
      }

      if(errorRes?.error?.status?.message == "invalid signature"){
        localStorage.removeItem('userData');
        return throwError("Some error occurred, please reload again");
      }
      else{
        errorMessage = errorRes.error.status.message;
        return throwError(errorMessage);
      }

  }
}

 