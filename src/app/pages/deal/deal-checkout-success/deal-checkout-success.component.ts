import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deal-checkout-success',
  templateUrl: './deal-checkout-success.component.html',
  styles: [
  ]
})
export class DealCheckoutSuccessComponent implements OnInit {
  private userSub:Subscription;

  isLoading = true; user:User;
  sessionId:string; orderId:string;

  constructor(private route: ActivatedRoute, private router:Router,
    private cartService :CartService, private authService:AuthService
  ) { 
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['sessionId'];
      this.orderId = params['orderId'];
    });
    
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    // this.cartService.handleCheckoutSuccess(this.sessionId, this.orderId).subscribe(
    //   resData => {
    //     // console.log(resData);   
    //     this.setCartCount(0)
    //     this.router.navigate([`${environment.dealsBaseUrl}/purchase-thankyou`]);       
    //   },
    //   errorMessage => {
    //     alert(errorMessage);
    //   },
    // )
  }
  
  setCartCount(ccnt:Number) {
    const updatedUser = { ...this.user, ccnt: ccnt };
    this.authService.updateCartCount(ccnt, updatedUser);
  }
}
