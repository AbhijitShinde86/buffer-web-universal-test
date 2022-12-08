import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-joined-products',
  templateUrl: './joined-products.component.html',
  styles: [
  ]
})
export class JoinedProductsComponent implements OnInit {
  private userSub: Subscription;

  user:User; productsData = []; isLoading = false; 

  constructor(private authService: AuthService, private userService:UserService,
    private betaHomeService:BetaHomeService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        this.getJoinProductsData();
      }
    });
  }

  ngOnInit(): void {
  }
  
  getJoinProductsData(){
    this.isLoading = true; 
    this.userService.getJoinProducts(this.user.id).subscribe(
      res => {
        this.productsData = res.data.filter(d => d.startupStatus == 'fet' && d.isDeleted == false); ;
        // console.log(this.productsData)
        this.isLoading = false; 
      },
        errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
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
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
