import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-deals',
  templateUrl: './header-deals.component.html',
  styles: [
  ]
})
export class HeaderDealsComponent implements OnInit {  
  private cartCountSub:Subscription;
  
  @Input() userData :User; 
  
  cartCount:Number;

  constructor(private router:Router, private authService:AuthService) { 
    this.cartCountSub = this.authService.cartCount.subscribe(cartCount => this.cartCount = cartCount );
  }

  ngOnInit(): void {
  }

  onSubmitDealsClick(){
    this.router.navigate([`${environment.dealsBaseUrl}/new`]);
  }
  
  onCartClick(){
    this.router.navigate([`${environment.dealsBaseUrl}/cart`]);
  }

  onVendorClick(){
    this.router.navigate([`/vendor`]);
  }

  ngOnDestroy() {
    if(this.cartCountSub){
      this.cartCountSub.unsubscribe();
    }
  }
}
