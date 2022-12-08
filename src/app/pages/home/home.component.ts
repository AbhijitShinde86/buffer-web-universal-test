import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { SendInBlueService } from 'src/app/services/sendinblue.service';
import { Patterns } from 'src/app/utilities/patterns';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  private userSub:Subscription;

  isLoading = false; user:User; submitted = false; 
  subscribeForm: FormGroup; private submitReleaseTimer: any;
  recentList = []; trendList = []; trendingDeal = null; 

  constructor(private meta:Meta, private title:Title, private authService : AuthService,
    private formBuilder: FormBuilder, private sendInBlueService: SendInBlueService,
    private betaHomeService:BetaHomeService, private router:Router,
    private toastrService:ToastrService
  ) { 
    this.initializeForm();
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
      }
    });
    this.getHomeStartUps();
    this.setMetaData(); this.setTitle(); 
  }

  ngOnInit(): void {
  }

  getHomeStartUps(){
    this.isLoading = true; 
    this.betaHomeService.getHomeStartUps().subscribe(
      res => {
        this.isLoading = false;
        this.recentList = res.data.recentList;
        this.trendList = res.data.trendList;
        // console.log(res.data)
      },
      errorMessage => { this.isLoading = false; }
    );    
  }
  
  onStartupClick(startupLink:string){
    const url = `${environment.betaBaseUrl}/${startupLink}`
    this.router.navigate([url])
  }

  
  onLikeClick(startup:any){
    if(this.user){
      if(startup.userLikeCount == 0){
        this.betaHomeService.addStartupLike(startup._id).subscribe(
          resData => {
            this.updateStartupLike(startup,'add');
          },
          errorMessage => {}  
        );
      }else{
        this.betaHomeService.removeStartupLike(startup._id).subscribe(
          resData => {
            this.updateStartupLike(startup,'remove');
          },
          errorMessage => {}  
        );
      }
    }
    else
      this.authService.setLaunchLogin({"action":"Like"});
  }

  updateStartupLike(startup:any, action:string){
    startup.userLikeCount = startup.userLikeCount == 0 ? 1 : 0;
    startup.likeCount = action == 'add' ? (startup.likeCount + 1) : (startup.likeCount - 1); 
  }

  setLike(startup: any, listType:string): void {
    this.onLikeClick(startup);
  }

  setMetaData() {
    this.meta.addTags([
      {name:'description', content:'BufferApps- A Platform For Everyday Entrepreneurs! Discover, Test, and Buy Your Favorite SaaS.'},
      {name:'keywords', content:'BufferApps, Beta launch platform for saas, Saas beta platform, Saas marketplace, Ltd saas platform'}
    ]);
  }

  setTitle() {
    this.title.setTitle('BufferApps - A SaaS Launchpad | Discover Best SaaS For 2022');
  }

  get f() { return this.subscribeForm.controls; }  

  onSubmit(){
    this.submitted = true;
    if (this.subscribeForm.valid) {
      if(confirm("Are you sure to subscribe?")) {
        this.isLoading = true;         
        this.sendInBlueService.addSubscribeEmail(this.subscribeForm.value).subscribe(
          resData => {
            // console.log(resData);  
            this.isLoading = false; this.submitted = false; 
            this.initializeForm();
            this.toastrService.success("Email subscribe successfully");
          },
          errorMessage => {
            // console.log(errorMessage.error);
            this.isLoading = false; this.submitted = false; 
            if( errorMessage.error.code == 'duplicate_parameter'){              
              this.toastrService.success("Email subscribe successfully");
              this.initializeForm();
            }else{
              this.toastrService.error('An unknown error occurred!');
            }
          }  
        );
      }
    }
    else{
      this.submitReleaseTimer = setTimeout(() => {
        this.submitted = false;
      }, 1500);
      return;
    }
  }

  private initializeForm() {
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Patterns.emailPattern)]]
    });
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
