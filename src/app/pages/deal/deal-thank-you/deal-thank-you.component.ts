import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deal-thank-you',
  templateUrl: './deal-thank-you.component.html',
  styles: [
  ]
})
export class DealThankYouComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onProductsClick(){
    this.router.navigate(['/user/dashboard/purchased-deals']);
  }

  onContinueShopping(){
    this.router.navigate([`${environment.dealsBaseUrl}`]);
  }
}
