import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../../auth/auth.guard';

import { SharedModule } from '../../shared/shared.module';
import { CategoriesComponent } from './categories.component';
import { StartupListComponent } from './startup-list/startup-list.component';

const routes = [
    { path: '', component: CategoriesComponent }, 
    { path: ':link', component: StartupListComponent },
    { path: '**', redirectTo:"/" }  
];

@NgModule({
    declarations: [
        CategoriesComponent,
        StartupListComponent
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
export class CategoriesModule {}
