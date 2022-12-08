import { Component, Input, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { BetaHomeService } from 'src/app/services/beta_home.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Patterns } from 'src/app/utilities/patterns';
import { SendInBlueService } from 'src/app/services/sendinblue.service';
import { helper } from '../../utilities/helper'

@Component({
  selector: 'app-beta-home',
  templateUrl: './beta-home.component.html',
  styles: [
  ]
})
export class BetaHomeComponent implements OnInit {
  private userSub:Subscription;
  
  user:User; isLoading = false; size = 2; curPage = 1;
  catId = "62cb056a7d0d21b326e744a6"; catName = "Popular";
  startUps = []; defStartUpGroupList = []; defStartUps = []; isShowLoadMore = false
  submitted = false; 
  subscribeForm: FormGroup; private submitReleaseTimer: any;

  constructor(private authService : AuthService, private betaHomeService:BetaHomeService,
    private meta:Meta, private title:Title, private router:Router, 
    private formBuilder: FormBuilder, private sendInBlueService: SendInBlueService,
    private toastrService:ToastrService
  ) {
    this.initializeForm();
    this.meta.addTags([
      {name:'description', content:'BufferApps- Beta Home for new startups. It is a place to discover and get early access to exciting new startups.'},
      {name:'keywords', content:'beta, buffer'}
    ]);
    this.title.setTitle('BufferApps- Beta Listing Platform | Discover Best SaaS For 2022');

    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){ this.user = user; }
    });
    this.getStartUps();
  }

  ngOnInit(): void {
  }
  
  onSubmitProductClick(){
    this.router.navigate([`${environment.betaBaseUrl}/new`]);
  }
  
  getStartUps(){
    this.isLoading = true; 
    this.betaHomeService.getStartUps(1, this.size).subscribe(
      res => {
        this.isLoading = false;
        this.startUps = res.data.featureList;
        if(res.data?.list?.length > 0){
          this.defStartUpGroupList = [...this.defStartUpGroupList, ...res.data.list[0].results];
          res.data.list[0].results.forEach(element => {
            this.defStartUps = [...this.defStartUps, ...element.list];
          });   

          if(res.data.list[0].totalCount?.length > 0){
            const totalCount = res.data.list[0].totalCount[0].count;
            this.isShowLoadMore =  (totalCount > (1 * this.size ))
            // console.log(this.totalCount)
          }
        }           
        // console.log(res.data)
      },
      errorMessage => { this.isLoading = false; }
    );    
  }

  getDefaultCatStartUpList(pageNo){
    this.isShowLoadMore = false;
    this.isLoading = true; 
    this.betaHomeService.getDefaultStartUpList(pageNo, this.size).subscribe(
      res => {
        if(res.data?.length > 0){
          this.defStartUpGroupList = [...this.defStartUpGroupList, ...res.data[0].results];
          res.data[0].results.forEach(element => {
            this.defStartUps = [...this.defStartUps, ...element.list];
          });   

          if(res.data[0].totalCount?.length > 0){
            const totalCount = res.data[0].totalCount[0].count;
            this.isShowLoadMore =  (totalCount > (pageNo * this.size ));
          }
        }           
        this.isLoading = false;
      },
      errorMessage => { 
        this.isLoading = false; 
      }
    );    
  }

  loadMoreClick(){
    this.curPage = this.curPage +1;
    this.getDefaultCatStartUpList(this.curPage)
  }

  setLike(startup: any, listType:string): void {
    if(startup.userLikeCount == 0){
      this.betaHomeService.addStartupLike(startup._id).subscribe(
        resData => {
          this.updateStartupLike(startup, listType, 'add');
        },
        errorMessage => {}  
      );
    }else{
      this.betaHomeService.removeStartupLike(startup._id).subscribe(
        resData => {
          this.updateStartupLike(startup, listType, 'remove');
        },
        errorMessage => {}  
      );
    }
  }

  updateStartupLike(startup: any, listType:string, action:string){
    if(listType == 'default'){
      let itemIndex = this.defStartUps.indexOf(startup);
      this.defStartUps[itemIndex].userLikeCount = startup.userLikeCount == 0 ? 1 : 0;
      this.defStartUps[itemIndex].likeCount = action == 'add' ? (startup.likeCount + 1) : (startup.likeCount - 1);      
    }else{
      let itemIndex = this.startUps.indexOf(startup);
      this.startUps[itemIndex].userLikeCount = startup.userLikeCount == 0 ? 1 : 0;
      this.startUps[itemIndex].likeCount = action == 'add' ? (startup.likeCount + 1) : (startup.likeCount - 1);  
    }
  }

  getListName(listId:string){
    return helper.getListName(listId);
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

  ngOnDestroy() {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}

