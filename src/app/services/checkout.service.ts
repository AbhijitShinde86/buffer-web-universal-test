import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CheckoutService {
  checkoutData = new BehaviorSubject<any>(null);

  setCheckoutData(data:any){
    this.checkoutData.next(data);
  }
  
}
