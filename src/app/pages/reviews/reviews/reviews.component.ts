import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { ActiveReviewInterface } from '../types/activeReview.interface';

@Component({
  selector: 'reviews',
  templateUrl: './reviews.component.html',
  styles: [
  ]
})
export class ReviewsComponent implements OnInit {
  @Input() reviews!:[];
  @Input() currentDealId!: string;
  @Input() currentUser!: User;
  @Input() isVendor!: Boolean;
  @Input() dealUserId!:string;
  
  activeReview: ActiveReviewInterface | null = null;

  constructor() {}

  ngOnInit(): void {   
  }

  setActiveReview(activeReview: ActiveReviewInterface | null): void {
    // console.log("setActiveReview : ",activeReview);
    this.activeReview = activeReview;
  }  

}
