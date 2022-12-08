import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-startups',
  templateUrl: './startups.component.html',
  styles: [
  ]
})
export class StartupsComponent implements OnInit {
  private routeSub:Subscription;
  
  username=""; productsData = []; isLoading = false; 

  constructor(private route: ActivatedRoute, private userService:UserService,
    private betaHomeService:BetaHomeService,
    private toastrService:ToastrService
  ) { 
    this.routeSub = this.route.parent.params.subscribe((params: Params) => {
      this.username = params['username'];
      if(this.username)
        this.getProductsData();
    });  
  }

  ngOnInit(): void {
  }
  
  getProductsData(){    
    this.isLoading = true; 
    this.userService.getProducts(this.username).subscribe(
      res => {
        this.productsData = res.data;
        // console.log(this.productsData);
        this.isLoading = false; 
      },
      errorMessage => { 
        this.isLoading = false;  //this.toastrService.error(errorMessage); 
      }
    )
  }
  
  setLike(startup: any): void {
    if(startup.userLikeCount == 0){
      this.betaHomeService.addStartupLike(startup.startupId).subscribe(
        resData => {
          this.updateStartupLike(startup, 'add');
        },
        errorMessage => {}  
      );
    }else{
      this.betaHomeService.removeStartupLike(startup.startupId).subscribe(
        resData => {
          this.updateStartupLike(startup, 'remove');
        },
        errorMessage => {}  
      );
    }
  }
  
  updateStartupLike(startup: any, action:string){
    let itemIndex = this.productsData.indexOf(startup);
      this.productsData[itemIndex].userLikeCount = startup.userLikeCount == 0 ? 1 : 0;
      this.productsData[itemIndex].likeCount = action == 'add' ? (startup.likeCount + 1) : (startup.likeCount - 1);   
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
