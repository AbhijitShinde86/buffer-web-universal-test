import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { FeedbacksService } from 'src/app/services/feedbacks.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { FeedbackReplyComponent } from './feedback-reply/feedback-reply.component';

@NgModule({
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    QuillModule.forRoot(),
    PickerModule  
  ],
  declarations: [FeedbacksComponent, FeedbackComponent, FeedbackFormComponent, FeedbackReplyComponent ],
  providers: [FeedbacksService],
  exports: [FeedbacksComponent, FeedbackComponent, FeedbackFormComponent,FeedbackReplyComponent]
  })
export class FeedbacksModule {}
