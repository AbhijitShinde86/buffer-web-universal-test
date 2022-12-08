import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { VendorService } from 'src/app/services/vendor.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-beta',
  templateUrl: './header-beta.component.html',
  styles: [
  ]
})
export class HeaderBetaComponent implements OnInit {
  @Input() userData :User;

  isLoading = false; categories = []; 
  signUpModalDisplay = 'none';

  constructor(private authService:AuthService, private router:Router,
    private vendorService:VendorService
  ) { 
      this.getCategoriesList(); 
  }

  ngOnInit(): void {
  }
  
  
  getCategoriesList(){
    this.categories = [
      {
        "marketName": "Productivity",
        "marketLink": "productivity"
      },
      {
        "marketName": "Finance",
        "marketLink": "finance"
      },
      {
        "marketName": "Saas",
        "marketLink": "saas"
      },
      {
        "marketName": "Accounting",
        "marketLink": "accounting"
      },
      {
        "marketName": "Advertising",
        "marketLink": "advertising"
      }
    ];
    // this.categories = []; 
    // this.isLoading = true; 
    // this.betaHomeService.getCategoriesList().subscribe(
    //   res => {
    //       this.categories = res.data;
    //       this.isLoading = false;
    //   },
    //   errorMessage => { this.isLoading = false;}
    // );    
  }
  
  onCategoriesClick(){
    this.router.navigate([`${environment.betaBaseUrl}/categories`]);
  }
  
  onSelectedCategoriesClick(marketLink){
    this.router.navigate([`${environment.betaBaseUrl}/categories/${marketLink}`]);
  }

  onSubmitProductClick(){
    this.router.navigate([`${environment.betaBaseUrl}/new`]);
  }

  onVendorClick(){
    this.vendorService.getStartupCount().subscribe(
      res => {
          const startupCount = res.data ?? 0;
          if(startupCount > 0)
            this.router.navigate([`/vendor`]);
      },
      errorMessage => { }
    );    
  }

}
