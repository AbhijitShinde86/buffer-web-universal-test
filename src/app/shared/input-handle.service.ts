import { Injectable } from "@angular/core";
import {  HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ToastrService } from "ngx-toastr";

@Injectable({providedIn:'root'})

export class InputHandleService{    

    checkPressNumbers(event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        // Only Numbers 0-9
        if ((charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        } else {
            return true;
        }
    }

    checkNumbersWithDecimal(event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    checkAlphanumeric(event) {
      var inp = String.fromCharCode(event.keyCode);

      if (/[a-zA-Z0-9 ]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

}

 