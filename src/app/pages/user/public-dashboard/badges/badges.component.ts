import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styles: [
  ]
})
export class BadgesComponent implements OnInit {
  private routeSub:Subscription;
  
  username=""; badgesData = []; isLoading = false; 

  constructor(private route: ActivatedRoute, private userService:UserService,
    private toastrService:ToastrService
  ) { 
    this.routeSub = this.route.parent.params.subscribe((params: Params) => {
      this.username = params['username'];
      if(this.username)
        this.getBadgesData();
    });  
  }

  ngOnInit(): void {
  }
  
  getBadgesData(){
    this.isLoading = true; 
    this.userService.getBadges(this.username).subscribe(
      res => {
        if(res.data.length > 0 ){
          if(res.data[0].requestCount > 0)
            this.badgesData.push({ type: "betaTester", imageUrl:"beta-tester.png", name : "Beta Tester"});            
          if(res.data[0].likeCount > 0)
            this.badgesData.push({ type: "clapper", imageUrl:"clapper.png", name : "Clapper"})
          //startupCount
        }
        // console.log(this.badgesData)
        this.isLoading = false; 
      },
      errorMessage => { 
        this.isLoading = false;  //this.toastrService.error(errorMessage); 
      }
    )
  }
  
  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
