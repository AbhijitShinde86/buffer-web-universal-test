import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { DealsHomeComponent } from './deals-home.component';

const routes = [
    { path: '', component: DealsHomeComponent}
];

@NgModule({
    declarations: [
        DealsHomeComponent
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
export class DealsHomeModule {}
