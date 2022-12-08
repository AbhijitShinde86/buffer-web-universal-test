import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-deal-new-thankyou',
  templateUrl: './deal-new-thankyou.component.html',
  styles: [
  ]
})
export class DealNewThankyouComponent implements OnInit {

  constructor(private authService : AuthService, private windowRefService: WindowRefService) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
  }

  ngOnInit(): void {
  }

}
