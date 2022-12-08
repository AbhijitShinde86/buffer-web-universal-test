import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { QuestionComponent } from './components/question/question.component';
import { QuestionFormComponent } from './components/questionForm/questionForm.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { QuestionsService } from '../../services/questions.service';

@NgModule({
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    QuillModule.forRoot(),
    PickerModule  
  ],
  declarations: [QuestionsComponent, QuestionComponent, QuestionFormComponent],
  providers: [QuestionsService],
  exports: [QuestionsComponent],
})
export class QuestionsModule {}
