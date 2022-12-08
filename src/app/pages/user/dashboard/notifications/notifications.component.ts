import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styles: []
})
export class NotificationsComponent implements OnInit {
  private userSub: Subscription;

  user:User; notificationsData = []; isLoading = false; 

  constructor(private authService: AuthService, private userService:UserService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        this.getNotificationsData();
      }
    });}

  ngOnInit(): void {
  }
  
  getNotificationsData(){
    this.isLoading = true; 
    this.userService.getNotifications(this.user.id).subscribe(
      res => {
        this.notificationsData = res.data.filter((n) => n.notifyBy != null);
        // console.log(this.notificationsData)
        this.isLoading = false; 
      },
        errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
      )
  }
  
  onCloseNotification(id){
    this.userService.removeNotification(id, this.user.id).subscribe(
      res => {
        this.notificationsData = res.data;
      },
      errorMessage => {
        this.getNotificationsData();
        this.toastrService.error(errorMessage);
      }        
    );
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }

}
