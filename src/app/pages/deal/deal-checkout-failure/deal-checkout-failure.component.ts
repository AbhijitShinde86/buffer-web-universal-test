import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-deal-checkout-failure',
  templateUrl: './deal-checkout-failure.component.html',
  styles: [
  ]
})
export class DealCheckoutFailureComponent implements OnInit {
  sessionId:string; orderId:string;

  constructor(private route: ActivatedRoute, private cartService :CartService) { 
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['sessionId'];
      this.orderId = params['orderId'];
    });
  }

  ngOnInit(): void {
    // this.cartService.handleCheckoutFailure(this.sessionId, this.orderId).subscribe(
    //   resData => {
    //     // console.log(resData);    
    //   },
    //   errorMessage => {
    //     alert(errorMessage);
    //   },
    // )
  }
}
