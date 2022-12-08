import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { ReviewService } from 'src/app/services/review.service';
import { ReviewsComponent } from './reviews/reviews.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReviewComponent } from './review/review.component';
import { ReplyFormComponent } from './reply-form/reply-form.component';
import { ReviewReplyComponent } from './review-reply/review-reply.component';

@NgModule({
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    QuillModule.forRoot(),
    PickerModule,
    SharedModule  
  ],
  declarations: [ReviewsComponent, ReviewComponent, ReplyFormComponent, ReviewReplyComponent],
  providers: [ReviewService],
  exports: [ReviewsComponent]
  })
export class ReviewsModule {}
