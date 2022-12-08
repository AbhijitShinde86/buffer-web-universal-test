import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { ToastrModule } from 'ngx-toastr';
import { NgxStripeModule } from 'ngx-stripe';

import { QuillModule } from 'ngx-quill';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core.module';
import { SharedModule } from './shared/shared.module';


import { CommentsModule } from './pages/comments/comments.module';
import { FeedbacksModule } from './pages/feedbacks/feedbacks.module';
import { QuestionsModule } from './pages/questions/questions.module';
import { ReviewsModule } from './pages/reviews/reviews.module';


import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';

import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { HeaderDealsComponent } from './layout/header-deals/header-deals.component';
import { HeaderBetaComponent } from './layout/header-beta/header-beta.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MainComponent } from './layout/main/main.component';
import { SubfooterComponent } from './layout/subfooter/subfooter.component';
import { VendorLayoutComponent } from './layout/vendor-layout/vendor-layout.component';
import { VendorFooterComponent } from './layout/vendor-footer/vendor-footer.component';

import { LoadingComponent } from './loading';

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

import { VendorHomeComponent } from './pages/vendor/vendor-home/vendor-home.component';
import { VendorBetaComponent } from './pages/vendor/vendor-beta/vendor-beta.component';
import { VendorDealComponent } from './pages/vendor/vendor-deal/vendor-deal.component';
import { RequestsComponent } from './pages/vendor/requests/requests.component';
import { UserRequestDetailsComponent } from './pages/vendor/user-request-details/user-request-details.component';

@NgModule({
  declarations: [
    AppComponent,

    DefaultLayoutComponent,
    HeaderComponent,
    HeaderDealsComponent,
    HeaderBetaComponent,
    FooterComponent,
    MainComponent,
    SubfooterComponent,
    VendorLayoutComponent,
    VendorFooterComponent,

    LoadingComponent,

    AdminStartupPreviewComponent,

    DealComponent,
    DealNewComponent,
    DealThankYouComponent,
    DealCartComponent,
    DealCheckoutComponent,
    DealCheckoutSuccessComponent,
    DealCheckoutFailureComponent,
    DealContentComponent,
    DealNewThankyouComponent,

    JoinBetaComponent,

    WelcomeComponent,
    NewsLetterComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    SecurityPolicyComponent,
    ContactComponent,
    AboutComponent,

    StartupComponent,
    StartupNewComponent,
    StartupEditComponent,
    ThankYouComponent,
    StartupFeedbackComponent,
    StartupPreviewComponent,

    VendorHomeComponent,
    VendorBetaComponent,
    VendorDealComponent,
    RequestsComponent,
    UserRequestDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true
    }),
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    QuillModule,
    PickerModule,
    NgxStripeModule.forRoot(environment.stripeClientKey),
    CoreModule,
    SharedModule,
    CommentsModule,
    FeedbacksModule,
    QuestionsModule,
    ReviewsModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId,{
                plugin_name: "chat"
              }
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              environment.facebookAppId
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
