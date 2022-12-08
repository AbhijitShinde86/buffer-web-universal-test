import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styles: []
})
export class CreditsComponent implements OnInit {
  private userSub: Subscription;

  isLoading = false; curUserData; user:User;
  submitted = false; giftCardForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService : AuthService, 
    private userService:UserService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        this.getUserData();
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  get f() { return this.giftCardForm.controls; }  

  onSubmit(){
    this.submitted = true;
    if (!this.giftCardForm.valid) {
      return false;
    }
    if(confirm("Are you sure to redeem gift card?")) {
      this.isLoading = true; 
      const giftCardNo = this.giftCardForm.value.giftCardNo; 
      // console.log(giftCardNo);
      this.userService.redeemGiftCard(giftCardNo).subscribe(
        resData => {
          // console.log(resData);  
          this.isLoading = false; this.submitted = false; 
          this.initializeForm();
          this.toastrService.success("Gift card redeemed successfully");
          this.getUserData();
        },
        errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
      );
    }
    return true;
  }

  getUserData(){
    this.isLoading = true; 
    this.userService.getUser(this.user.id).subscribe(
      res => {
        this.curUserData = res.data;
        // console.log(this.curUserData);  
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }

  
  private initializeForm() {
    this.giftCardForm = this.formBuilder.group({
      giftCardNo: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
