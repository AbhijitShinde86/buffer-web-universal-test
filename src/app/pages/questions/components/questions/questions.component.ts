import { Component, Input, OnInit } from '@angular/core';

import { User } from 'src/app/auth/user.model';
import { ActiveQuestionInterface } from '../../types/activeQuestion.interface';

@Component({
  selector: 'questions',
  templateUrl: './questions.component.html',
  styles: [
  ]
})
export class QuestionsComponent implements OnInit {
  @Input() questions!:[];
  @Input() currentDealId!: string;
  @Input() currentUser!: User;
  @Input() isVendor!: Boolean;
  @Input() dealUserId!:string;

  activeQuestion: ActiveQuestionInterface | null = null;

  constructor() {}

  ngOnInit(): void {
    // console.log("questions : ",this.questions);
  }

  setActiveQuestion(activeQuestion: ActiveQuestionInterface | null): void {
    // console.log("setActiveQuestion : ",activeQuestion);
    this.activeQuestion = activeQuestion;
  }  
}
