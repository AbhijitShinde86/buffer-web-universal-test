import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { environment } from 'src/environments/environment';

import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

import { P404Component } from './shared/p404/p404.component';
import { P500Component } from './shared/p500/p500.component';

import { AdminStartupPreviewComponent } from './pages/admin/startup/admin-startup-preview/admin-startup-preview.component';

import { DealComponent } from './pages/deal/deal/deal.component';
import { DealNewComponent } from './pages/deal/deal-new/deal-new.component';
import { DealThankYouComponent } from './pages/deal/deal-thank-you/deal-thank-you.component';
import { DealCartComponent } from './pages/deal/deal-cart/deal-cart.component';
import { DealCheckoutComponent } from './pages/deal/deal-checkout/deal-checkout.component';
import { DealCheckoutSuccessComponent } from './pages/deal/deal-checkout-success/deal-checkout-success.component';
import { DealCheckoutFailureComponent } from './pages/deal/deal-checkout-failure/deal-checkout-failure.component';
import { DealContentComponent } from './pages/deal/deal-content/deal-content.component';
import { DealNewThankyouComponent } from './pages/deal/deal-new-thankyou/deal-new-thankyou.component';

import { JoinBetaComponent } from './pages/join-beta/join-beta.component';

import { WelcomeComponent } from './pages/resources/welcome/welcome.component';
import { NewsLetterComponent } from './pages/resources/news-letter/news-letter.component';
import { TermsComponent } from './pages/resources/terms/terms.component';
import { PrivacyPolicyComponent } from './pages/resources/privacy-policy/privacy-policy.component';
import { SecurityPolicyComponent } from './pages/resources/security-policy/security-policy.component';
import { ContactComponent } from './pages/resources/contact/contact.component';
import { AboutComponent } from './pages/resources/about/about.component';

import { StartupComponent } from './pages/startup/startup/startup.component';
import { StartupNewComponent } from './pages/startup/startup-new/startup-new.component';
import { StartupEditComponent } from './pages/startup/startup-edit/startup-edit.component';
import { ThankYouComponent } from './pages/startup/thank-you/thank-you.component';
import { StartupFeedbackComponent } from './pages/startup/startup-feedback/startup-feedback.component';
import { StartupPreviewComponent } from './pages/startup/startup-preview/startup-preview.component';

import { VendorLayoutComponent } from './layout/vendor-layout/vendor-layout.component';
import { VendorHomeComponent } from './pages/vendor/vendor-home/vendor-home.component';
import { VendorBetaComponent } from './pages/vendor/vendor-beta/vendor-beta.component';
import { VendorDealComponent } from './pages/vendor/vendor-deal/vendor-deal.component';
import { RequestsComponent } from './pages/vendor/requests/requests.component';
import { UserRequestDetailsComponent } from './pages/vendor/user-request-details/user-request-details.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '404', component: P404Component },
  { path: '500', component: P500Component },
  { path: 'welcome', component:  WelcomeComponent},     
  { path: 'information-security-policy', component: SecurityPolicyComponent },
  { path: 'newsletter', component: NewsLetterComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about-us', component: AboutComponent },
  { path: "join-beta", component:JoinBetaComponent },  
  { path: "user", loadChildren: () => import("./pages/user/user.module").then(m => m.UserModule) },
  { path: "", pathMatch: 'full', loadChildren: () => import("./pages/home/home.module").then(m => m.HomeModule) },  
  {
    path: `${environment.betaBaseUrl.replace('/','')}`,
    children: [      
      { path: "", pathMatch: 'full', loadChildren: () => import("./pages/beta-home/beta-home.module").then(m => m.BetaHomeModule) },
      { path: 'new', component: StartupNewComponent }, 
      { path: 'thankyou', component: ThankYouComponent, canActivate: [AuthGuard] },
      { path: ':link/edit', component: StartupEditComponent, canActivate: [AuthGuard] },
      { path: ':link/feedback', component: StartupFeedbackComponent, canActivate: [AuthGuard] },
      { path: ':link/preview', component: StartupPreviewComponent },
      { path: ':link', component: StartupComponent },    
      { path: "categories", loadChildren: () => import("./pages/categories/categories.module").then(m => m.CategoriesModule) }
    ]
  },  
  {
    path: `${environment.dealsBaseUrl.replace('/','')}`,
    children: [      
      { path: "", pathMatch: 'full', loadChildren: () => import("./pages/deals-home/deals-home.module").then(m => m.DealsHomeModule) },
      { path: 'new', component: DealNewComponent }, 
      { path: 'thankyou', component:DealNewThankyouComponent, canActivate: [AuthGuard] },
      { path: 'cart', component: DealCartComponent, canActivate: [AuthGuard] },
      { path: 'checkout/success', component: DealCheckoutSuccessComponent, canActivate: [AuthGuard] },
      { path: 'checkout/failure', component: DealCheckoutFailureComponent, canActivate: [AuthGuard] },
      { path: 'checkout', component: DealCheckoutComponent, canActivate: [AuthGuard] },
      { path: 'purchase-thankyou', component: DealThankYouComponent, canActivate: [AuthGuard] },
      { path: ':link/draft', component: DealContentComponent, canActivate: [AuthGuard] },
      { path: ':link', component: DealComponent }
    ]
  },  
  {
    path: 'vendor',
    children: [  
      { path: '', pathMatch: 'full', component: VendorHomeComponent, canActivate: [AuthGuard] },
      { path: 'requests/:link', component: RequestsComponent, canActivate: [AuthGuard] },
      { path: 'requests/:link/:id', component: UserRequestDetailsComponent, canActivate: [AuthGuard] },
      { path: 'beta/:link', component: VendorBetaComponent, canActivate: [AuthGuard] },
      { path: 'deals/:link', component: VendorDealComponent, canActivate: [AuthGuard] },  
    ]
  },  
  {
    path : 'admin',
    children: [      
      { path: `${environment.betaBaseUrl.replace('/','')}/:link/preview`, 
      component: AdminStartupPreviewComponent },
    ]
  },  
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'top' 
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
