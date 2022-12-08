import { Component, Input, OnInit } from '@angular/core';

import { User } from 'src/app/auth/user.model';
import { ActiveFeedbackInterface } from '../types/activeFeedback.interface';

@Component({
  selector: 'feedbacks',
  templateUrl: './feedbacks.component.html',
  styles: [
  ]
})
export class FeedbacksComponent implements OnInit {
  @Input() feedbacks!:[];
  @Input() currentStartupId!: string;
  @Input() currentUser!: User;
  @Input() isVendor!: Boolean;
  @Input() startupUserId!:string;

  activeFeedback: ActiveFeedbackInterface | null = null;

  constructor() {}

  ngOnInit(): void {
  }

  setActiveFeedback(activeFeedback: ActiveFeedbackInterface | null): void {
    // console.log("setActiveFeedback : ",activeFeedback);
    this.activeFeedback = activeFeedback;
  }  
}
