import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { P404Component } from './p404/p404.component';
import { P500Component } from './p500/p500.component';
import { StartupItemComponent } from './startup-item/startup-item.component';
import { DealItemComponent } from './deal-item/deal-item.component';
import { RatingComponent } from './rating/rating.component';
import { SharedStartupPreviewComponent } from './shared-startup-preview/shared-startup-preview.component';

import { NumberDirective } from '../utilities/numbers.directive';
import { AmountDirective } from '../utilities/amount.directive';
import { AutofocusDirective } from '../utilities/auto-focus.directive';
import { FormDirective } from '../utilities/form.directive';
import { NumberWithSpaceDirective } from '../utilities/numberWithSpace.directive';

@NgModule({
  declarations: [
    P404Component,
    P500Component,
    StartupItemComponent,
    DealItemComponent,
    RatingComponent,
    NumberDirective,
    AmountDirective,
    AutofocusDirective,
    FormDirective,
    NumberWithSpaceDirective,
    SharedStartupPreviewComponent
  ],
  imports: [FormsModule, CommonModule],
  exports: [
    P404Component,
    P500Component,
    StartupItemComponent,
    DealItemComponent,
    RatingComponent,
    NumberDirective,
    AmountDirective,
    AutofocusDirective,
    FormDirective,
    NumberWithSpaceDirective,
    SharedStartupPreviewComponent,
    CommonModule
  ]
})
export class SharedModule {}
