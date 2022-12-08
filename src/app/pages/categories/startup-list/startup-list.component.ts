import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-startup-list',
  templateUrl: './startup-list.component.html',
  styles: [
  ]
})
export class StartupListComponent implements OnInit {
  private routeSub:Subscription;

  categoryLink:string; isLoading = false; dataFound = false;
  categoryData: any; startupList = [];
  size = 8; curPage = 1; totalPages = 0 ;
  
  constructor(private route: ActivatedRoute, private router:Router,
    private betaHomeService:BetaHomeService, private toastrService:ToastrService
  ) { 
    this.getDefaultData();
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.categoryLink = params['link'];
      if(this.categoryLink)
        this.getCategory();
      });       
  }

  ngOnInit(): void {
  }

  getCategory(){
    this.categoryData = []; this.startupList = [];
    this.isLoading = true;
    this.betaHomeService.getCategoryByLink(this.categoryLink).subscribe(
      res => {
        if(res.data.length > 0){
          this.categoryData = res.data[0];
          const startupCount = +this.categoryData.startupCount
          if(startupCount > 0){
            this.getStartups(1);
            this.totalPages = startupCount / this.size;
          }
        }    
        else
          this.router.navigate([`${environment.betaBaseUrl}/categories`]);   
        this.isLoading = false;
      },
        errorMessage => { this.isLoading = false; this.toastrService.error(errorMessage); }
      )
  }

  getStartups(pageNo){
    if(pageNo == 1){
      this.startupList = this.getDefaultData();
    }
    this.isLoading = true; 
    this.betaHomeService.getCategoryStartUpList(this.categoryData._id, pageNo, this.size).subscribe(
      res => {
          if(res.data.length > 0){
            if(pageNo == 1)
              this.startupList = [];
            this.dataFound = true;
            this.startupList = [...this.startupList, ...res.data[0].startups];
            // console.log("startupList : ",this.startupList);
          }
          this.isLoading = false;  
          if(!this.dataFound)
            this.startupList = [];
        },
        errorMessage => { 
          if(!this.dataFound)
            this.startupList = [];
          this.isLoading = false; 
           this.toastrService.error(errorMessage); 
        }
      )
  }

  getDefaultData(){
    return [];
    // return [{
    //   "productName": "",
    //   "commentCount": 0,
    //   "likeCount": 0,
    //   "userLikeCount": 0,
    //   "imagePaths":[
    //     {
    //       "url_preview":"assets/gradientbg.png"
    //     }
    //   ],
    // }];
  }

  onCategoriesClick(){
    this.router.navigate([`${environment.betaBaseUrl}/categories`]);
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
    let itemIndex = this.startupList.indexOf(startup);
    this.startupList[itemIndex].userLikeCount = startup.userLikeCount == 0 ? 1 : 0;
    this.startupList[itemIndex].likeCount = action == 'add' ? (startup.likeCount + 1) : (startup.likeCount - 1); 
  }

  loadMoreClick(){
    this.curPage = this.curPage +1;
    // console.log("curPage : ",this.curPage);
    this.getStartups(this.curPage)
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
