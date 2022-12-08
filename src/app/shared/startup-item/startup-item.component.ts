import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-startup-item',
  templateUrl: './startup-item.component.html',
  styles: [
  ]
})
export class StartupItemComponent implements OnInit {
  @Input() startup: any;
  @Input() isEditable: boolean = false;
  @Input() isRequested: boolean = false;

  @Output() setLike = new EventEmitter<any>();
  
  private userSub:Subscription; user:User;
  
  constructor(private router:Router, private authService:AuthService) { 
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    this.startup.imagePaths.sort(this.compareOrder);
  }

  compareOrder(a, b) {
    return a.orderBy - b.orderBy;
  }
  
  onStartupClick(){
    const url = `${environment.betaBaseUrl}/${this.startup.startupLink}`
    this.router.navigate([url])
  }

  onLikeClick(){
    if(this.user)
      this.setLike.emit(this.startup)
    else
      this.authService.setLaunchLogin({"action":"Startup Like"});
  }

  onCommentsClick(){
    const url = `${environment.betaBaseUrl}/${this.startup.startupLink}`
    this.router.navigate([url])
  }

  onEditClick(){
    const url = `${environment.betaBaseUrl}/${this.startup.startupLink}/edit`;
    this.router.navigate([url])
  }
  
  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
