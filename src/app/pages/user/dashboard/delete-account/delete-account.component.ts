import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styles: [
  ]
})
export class DeleteAccountComponent implements OnInit {
  private userSub: Subscription;

  user:User; isLoading = false; 

  constructor(private authService: AuthService, private userService:UserService,
  private toastrService:ToastrService, private windowRefService: WindowRefService) {
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
  }

  onDeleteAccount(){
    if(confirm("Are you sure to delete account?")) {
      this.isLoading = true; 
      this.userService.deleteAccount(this.user.id).subscribe(
        resData => {
          //console.log(resData);
          this.isLoading = false;
          
          this.authService.logout();
          this.windowRefService.nativeWindow.location.reload();
        },
        errorMessage => {
          this.isLoading = false; 
           
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
