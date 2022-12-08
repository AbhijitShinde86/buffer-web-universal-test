import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { BetaHomeComponent } from './beta-home.component';

const routes = [
    { path: '', component: BetaHomeComponent}
];

@NgModule({
    declarations: [
        BetaHomeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    providers: []
})
export class BetaHomeModule {}
