import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DealHomeService } from 'src/app/services/deal_home.service';

@Component({
  selector: 'app-deals-home',
  templateUrl: './deals-home.component.html',
  styles: [
  ]
})
export class DealsHomeComponent implements OnInit {
  private userSub:Subscription;
  
  user:User; isLoading = false; size = 2; curPage = 1;
  isShowLoadMore = false; dealsGroupList = []; //dealsList = []; 
  
  constructor(private authService : AuthService, private router:Router, private dealHomeService:DealHomeService) {
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){ this.user = user; }
    });
    this.getDealList(1);
  }
  

  ngOnInit(): void {
  }

  getDealList(pageNo){
    this.isShowLoadMore = false;
    this.isLoading = true; 
    this.dealHomeService.getDealList(pageNo, this.size).subscribe(
      res => {        
        if(res.data?.length > 0){
          this.dealsGroupList = [...this.dealsGroupList, ...res.data[0].results];
          this.dealsGroupList.forEach(element => {
            element.list.forEach(deal => {
              deal["remainDays"] = this.getRemainOfferDays(deal.startDate,deal.endDate);
            });
          });   
          // console.log(this.dealsGroupList); 
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

  // onDealClick(dealLink){
  //   this.router.navigate([`${environment.dealsBaseUrl}/${dealLink}`])
  // }

  loadMoreClick(){
    this.curPage = this.curPage +1;
    this.getDealList(this.curPage)
  }
  
  getRemainOfferDays(startDate,endDate){
    let remainDays = 365;
    if(startDate!= null && endDate!= null){
      // The number of milliseconds in one day
      const ONE_DAY = 1000 * 60 * 60 * 24;

      // Calculate the difference in milliseconds
      const differenceMs = Math.abs(startDate - endDate);

      // Convert back to days and return
      remainDays = Math.round(differenceMs / ONE_DAY);
    }
    return remainDays;
  }

  getListName(listId){
    const year = listId.split('-')[0];
    const month = listId.split('-')[1];
    let monthName ="";
    switch(month){
      case "01":
        monthName = "January";
      break;
      case "02":
        monthName = "February";
      break;
      case "03":
        monthName = "March";
      break;
      case "04":
        monthName = "April";
      break;
      case "05":
        monthName = "May";
      break;
      case "06":
        monthName = "June";
      break;
      case "07":
        monthName = "July";
      break;
      case "08":
        monthName = "August";
      break;
      case "091":
        monthName = "September";
      break;
      case "10":
        monthName = "October";
      break;
      case "11":
        monthName = "November";
      break;
      case "12":
        monthName = "December";
      break;
    }
    return `${monthName} ${year}`;
  }

  ngOnDestroy() {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
