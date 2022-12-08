import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { IMaskModule } from 'angular-imask';

import { AuthGuard } from '../../auth/auth.guard';

import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { JoinedProductsComponent } from './dashboard/joined-products/joined-products.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { DeleteAccountComponent } from './dashboard/delete-account/delete-account.component';
import { LikedProductsComponent } from './public-dashboard/liked-products/liked-products.component';
import { BadgesComponent } from './public-dashboard/badges/badges.component';
import { PurchasedDealsComponent } from './dashboard/purchased-deals/purchased-deals.component';
import { CreditsComponent } from './dashboard/credits/credits.component';
import { StartupsComponent } from './public-dashboard/startups/startups.component';
import { PublicDashboardComponent } from './public-dashboard/public-dashboard.component';
import { RedeemComponent } from './dashboard/redeem/redeem.component';
import { RefundComponent } from './dashboard/refund/refund.component';
import { InvoiceComponent } from './dashboard/invoice/invoice.component';
import { BetaProfileComponent } from './dashboard/beta-profile/beta-profile.component';

const routes = [
    { path: 'dashboard/redeem/:link/:orderId', component: RedeemComponent, canActivate: [AuthGuard]},
    { path: 'dashboard/refund/:link/:orderId', component: RefundComponent, canActivate: [AuthGuard]},
    { path: 'dashboard/invoice/:orderId', component: InvoiceComponent, canActivate: [AuthGuard]},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
        children:[
            { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
            { path: 'beta-profile', component: BetaProfileComponent, canActivate: [AuthGuard] },            
            { path: 'products', component: JoinedProductsComponent, canActivate: [AuthGuard] },
            { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
            { path: 'delete', component: DeleteAccountComponent, canActivate: [AuthGuard] },
            { path: 'purchased-deals', component: PurchasedDealsComponent, canActivate: [AuthGuard] },
            { path: 'credits', component: CreditsComponent, canActivate: [AuthGuard] }
        ] 
    },
    {
        path:':username', component: PublicDashboardComponent,
        children:[
            { path: 'startups', component: StartupsComponent },    
            { path: 'likedproducts', component: LikedProductsComponent },  
            { path: 'badges', component: BadgesComponent },           
        ] 
    },
    { path: '**', redirectTo:"/" }  
   
];

@NgModule({
    declarations: [ 
        DashboardComponent,
        ProfileComponent,
        JoinedProductsComponent,
        NotificationsComponent,
        DeleteAccountComponent,
        LikedProductsComponent,
        BadgesComponent,
        PurchasedDealsComponent,
        CreditsComponent,
        StartupsComponent,
        PublicDashboardComponent,
        RedeemComponent,
        RefundComponent,
        InvoiceComponent,
        BetaProfileComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SharedModule,
        // IMaskModule
    ],
    providers: []
})
export class UserModule {}
