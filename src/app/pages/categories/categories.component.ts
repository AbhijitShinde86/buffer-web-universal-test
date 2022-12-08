import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BetaHomeService } from 'src/app/services/beta_home.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styles: [
  ]
})
export class CategoriesComponent implements OnInit {

  categoriesData = []; isLoading = false; 

  constructor(private betaHomeService:BetaHomeService, private router:Router,
    private toastrService:ToastrService
  ) { 
    this.getCategories();
  }

  ngOnInit(): void {
  }

  getCategories(){
    this.isLoading = true;
    this.betaHomeService.getCategories().subscribe(
      res => {
        this.categoriesData = res.data;
        // console.log(this.categoriesData)
        this.isLoading = false;
      },
        errorMessage => { this.isLoading = false; this.toastrService.error(errorMessage); }
      )
  }

  onSelectedCategoriesClick(marketLink){
    this.router.navigate([`${environment.betaBaseUrl}/categories/${marketLink}`]);
  }
}
