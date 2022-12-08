import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

import { environment } from "../../environments/environment"


@Injectable({providedIn:'root'})
export class ShowToasterService{

  constructor(private toastr: ToastrService){}
    
  info(mesaage, title = environment.appName){
    this.toastr.info(mesaage, title); 
  }
  
  success(mesaage, title = environment.appName){
    this.toastr.success(mesaage, title); 
  }

  warning(mesaage, title = environment.appName){
    this.toastr.warning(mesaage, title, {timeOut: 4000}); 
  }

  show(mesaage, title = environment.appName){
    this.toastr.show(mesaage, title); 
  }
  
  error(errorMesaage, title = environment.appName){
      this.toastr.error(errorMesaage, title, {timeOut: 5000});  
  }
  
}