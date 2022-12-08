import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [
  ]
})
export class FooterComponent implements OnInit {
  @Input() userData :User;
  
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onCategoriesClick(){
    this.router.navigate([`${environment.betaBaseUrl}/categories`]);
  }

  onSubmitProductClick(){
    this.router.navigate([`${environment.betaBaseUrl}/new`]);
  }

}
