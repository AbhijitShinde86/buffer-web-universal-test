import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider,FacebookLoginProvider } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { MustMatch } from 'src/app/utilities/must-match.validator';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Patterns } from 'src/app/utilities/patterns';

import { SendInBlueService } from 'src/app/services/sendinblue.service';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {  
  @Input() userData :User;
  @Input() isBaseModule :boolean;
  @Input() isBetaModule :boolean;
  @Input() isDealsModule :boolean;
  
  private launchLoginSub:Subscription;
  
  isLoginMode = true; isLoading = false; submitted = false; submittedForgot = false;
  isForgotMode = false; isLoadingForgot:boolean = false;
  isOTPSentForgot = false; isValidMobileForgot:boolean = false;
  currUrl =""; isBetaPage = false; isDealsPage = false;
  signUpModalDisplay = 'none'; launchLoginData;
  categories = []; searchList=[]; searchtext = ""; showSearchBox=false;
  isOTPSent = false; message = null; error = null;

  registerForm: FormGroup; loginForm: FormGroup; 
  otpForm: FormGroup= new FormGroup({});
  forgotForm: FormGroup= new FormGroup({});

  constructor(private authService:AuthService, private router:Router, private formBuilder: FormBuilder, 
    private betaHomeService:BetaHomeService, private socialAuthService: SocialAuthService, 
    private sendInBlueService: SendInBlueService, private toastrService:ToastrService,
    @Inject(PLATFORM_ID) private platformId: any, private windowRefService: WindowRefService
  ) {     
    this.launchLoginSub = this.authService.launchLogin.subscribe(launchLoginData => {
      if(launchLoginData){
        // console.log("launchLoginData : ",launchLoginData);
        this.onShowSignUpModal(launchLoginData);
      }
    });
  }

  ngOnInit(): void {
    this.initializeForms();
    this.currUrl = this.router.url; 
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.currUrl = event.url;
        this.setBetaDealLink();
      }
      if(event instanceof NavigationStart){
        this.currUrl = event.url;
        this.setBetaDealLink();
      }
    })
    this.setBetaDealLink();
  }  
     
  onSwitchMode() {
    this.error = null;
    this.isLoginMode = !this.isLoginMode;
    this.setDefault();
  }

  get regF() { return this.registerForm.controls; }  
  get logF() { return this.loginForm.controls; }  
  get oF() { return this.otpForm.controls; }   
  get fgF() { return this.forgotForm.controls; }  

  onRegister(){
    this.submitted = true;    
    if(this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.checkUserForSignUp(formData.email);
    }
  }

  onLogin(){
    this.submitted = true;
    
    if(this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.isLoading = true;     
      // Encrypt Password
      var encryptPassword = CryptoJS.AES.encrypt(formData.password, environment.cryptoJsSecretKey).toString();  

      this.authService.login(formData.email, encryptPassword).subscribe(
        resData => {
          // console.log(resData);
          this.isLoading = false; 
          this.submitted = false;
          this.loginForm.reset();
          this.setUser();
        },
        errorMessage => {
          this.isLoading = false;   
          if(errorMessage === "UN_VERIFIED_USER"){
            this.isLoading = false;  this.submitted = false; 
            this.isOTPSent = true;
            this.setOTPFormDefault()  
          }else{
            this.showError(errorMessage);
          }
        }
      );
    }
  }

  private checkUserForSignUp(email: string) {
    this.authService.getUserByEmail(email).subscribe(
      resData => {
        // console.log(resData.data);
        if (resData.data) {
          this.isLoading = false; 
          this.showError("User exists already, please login instead.");
        }
        else {
          this.isLoading = false; 
          this.onSignUp();
        }
      },
      errorMessage => {
        this.isLoading = false; 
        this.showError(errorMessage);
      }
    );
  }
  
  onSignUp(){
    if(!this.registerForm.valid)
      return;
    
    this.isLoading = true; 
    const password = this.registerForm.value.password;
    // Encrypt Password
    var encryptPassword = CryptoJS.AES.encrypt(password, environment.cryptoJsSecretKey).toString();    

    this.authService.signup(this.registerForm.value, encryptPassword).subscribe(
      resData => {
        this.sendInBlueService.addNewUserEmail(resData?.data?.email).subscribe(
          resData => { // console.log(resData);  
          },
          errorMessage => { // console.log(errorMessage.error);
          }  
        );
        this.isLoading = false;  this.submitted = false;  
        this.isOTPSent = true;
        this.setOTPFormDefault();  
      },
      errorMessage => {
        this.isLoading = false;         
        this.showError(errorMessage);
      }
    );
  }

  onOTPFormSubmit(){
    this.submitted = true;  
    if (!this.otpForm.valid) {
      return;
    }
    const email = this.isLoginMode ? this.loginForm.value.email : this.registerForm.value.email;
    const otp = this.otpForm.value.otp;

    this.isLoading = true; 
    this.authService.verifyOTP(email, otp).subscribe(
      resData => {
        //console.log(resData);
        this.isLoading = false; 
        this.registerForm.reset();
        this.setUser();
      },
      errorMessage => {
        this.isLoading = false;         
        this.showError(errorMessage);
      }
    );
  }

  onResendOTP():void {
    this.setOTPFormDefault();   

    const email = this.isLoginMode ? this.loginForm.value.email : this.registerForm.value.email;    
    this.isLoading = true; 
    this.authService.resendOTP(email).subscribe(
      resData => {
        //console.log(resData);
        this.isLoading = false; 
        this.toastrService.info("OTP sent successfully.")
      },
      errorMessage => {
        this.isLoading = false;         
        this.showError(errorMessage);
      }
    );
  }

  
  onForgotPassword(){
    this.isForgotMode = true; 
    this.setForgotFormDefault();
    this.forgotForm.controls['email'].enable();
    this.forgotForm.controls['password'].enable();
    this.forgotForm.controls['confirmPassword'].enable();
  }

  onOTPForgotFormSubmit(){
    if (this.fgF.email.errors) {
      return;
    }
    if (this.fgF.password.errors) {
      return;
    }
    if (this.fgF.confirmPassword.errors) {
      return;
    }
    
    if(confirm("Are you sure to send OTP to reset password?")) {
      this.isLoadingForgot = true;
      this.submittedForgot = true;
  
      const email =  this.forgotForm.value.email; 
      this.authService.sendForgotOTP(email).subscribe(
        resData => {
          //console.log(resData);
          this.isOTPSentForgot = true;
          this.forgotForm.controls['email'].disable();
          this.forgotForm.controls['password'].disable();
          this.forgotForm.controls['confirmPassword'].disable();
          
          this.isLoadingForgot = false;
          this.submittedForgot = false;
          this.toastrService.info("OTP sent successfully.")
        },
        errorMessage => {
          this.isLoadingForgot = false;
          this.submittedForgot = false;     
          this.showError(errorMessage);
        }
      );
    }
  }

  onCancelForgot(){
    this.removeForgotMode();
  }

  onResetPassword(){
    if (this.fgF.otp.errors) {
      return;
    }

    if(confirm("Are you sure to reset password?")) {
      this.isLoadingForgot = true;
      this.submittedForgot = true;

      const email = this.forgotForm.controls['email'].value; 
      const password = this.forgotForm.controls['password'].value; 
      const otp = this.forgotForm.controls['otp'].value; 
      
      // Encrypt Password
      var encryptPassword = CryptoJS.AES.encrypt(password, environment.cryptoJsSecretKey).toString();    
      
      this.authService.resetPassword(email,encryptPassword,otp).subscribe(
        resData => {
          //console.log(resData);
          this.isLoadingForgot = false;
          this.submittedForgot = false;
          this.forgotForm.reset();
          this.removeForgotMode();
          this.toastrService.info("Password reset successfully.");
        },
        errorMessage => {
          this.isLoadingForgot = false;
          this.submittedForgot = false;    
          this.showError(errorMessage);
        }
      );
    }
  }

  onResendOTPForgot(){
    const email = this.forgotForm.controls['email'].value; 

    if(confirm("Are you sure to resend OTP?")) {
      this.isLoadingForgot = true;
      this.authService.resendForgotOTP(email).subscribe(
        resData => {
          //console.log(resData);
          this.isLoadingForgot = false;
          this.toastrService.info("OTP sent successfully.")
        },
        errorMessage => {
          this.isLoadingForgot = false;        
          this.showError(errorMessage);
        }
      );
    }
  }

  removeForgotMode(){
    this.isForgotMode = false; this.isLoadingForgot = false; 
    this.isOTPSentForgot = false; 
    this.forgotForm.controls['email'].enable();
    this.forgotForm.controls['password'].enable();
    this.forgotForm.controls['confirmPassword'].enable();
  }


  setBetaDealLink(){
    this.isBetaPage = false; this.isDealsPage = false;
    this.isBetaPage = this.currUrl == environment.betaBaseUrl;
    this.isDealsPage = this.currUrl == environment.dealsBaseUrl;
  }

  onDealsClick(){
    this.router.navigate([environment.dealsBaseUrl]);
  }
  
  onBetaClick(){
    this.router.navigate([environment.betaBaseUrl]);
  }
  
  onShowSignUpModal(launchLoginData = null){
    this.launchLoginData = launchLoginData;
    // console.log("launchLoginData : ", this.launchLoginData);
    this.signUpModalDisplay = 'block';
    this.error = null;
    this.isLoginMode = true; this.isOTPSent = false; this.isForgotMode = false; 
    this.setDefault();
  }
  
  registerOrLoginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then( user => {
      this.registerOrLogin(user)
    });
  }
  
  registerOrLoginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then( user => {
      this.registerOrLogin(user)
    });
  }

  registerOrLogin(socialUser){
    this.authService.registerOrLogin(socialUser).subscribe(
      resData => {        
        if(resData?.data?.isNewUser){
          // console.log("registerOrLogin : ", resData);
          this.sendInBlueService.addNewUserEmail(resData?.data?.email).subscribe(
            resData => { // console.log(resData);  
            },
            errorMessage => { // console.log(errorMessage.error);
            }  
          );
        }
        this.setUser();
      },
      errorMessage => {}
    );
  }

  setUser(){
    this.signUpModalDisplay = 'none';
    // this.router.navigate(['/']);
    if(!this.launchLoginData?.blockReloadPage){
      if(isPlatformBrowser(this.platformId)) {
        this.windowRefService.nativeWindow.location.reload();
      }
    }
  }

  onLogout() {
    this.authService.logout();
    if(isPlatformBrowser(this.platformId)) {
      this.windowRefService.nativeWindow.location.reload();
    }
  }
  
  onSearchTextChange(){
    if(this.searchtext.length > 2){
      this.getSearchList();
    }
    else
      this.searchList = [];
  }

  getSearchList(){   
    this.searchList = []; this.isLoading = true; 
    this.betaHomeService.getSearchList(this.searchtext).subscribe(
      res => {
        const data =  res.data;
        data.forEach(searchRes => {
          const url = searchRes.type == "beta" ? 
                    `${environment.betaBaseUrl}/${searchRes.link}` : 
                    `${environment.dealsBaseUrl}/${searchRes.link}`;
          this.searchList.push({
            url:url,
            name:searchRes.name
          }) 
        });        
        this.isLoading = false; 
      },
      errorMessage => { this.isLoading = false;  }
    )
  }

  onProfileClick(){
    this.router.navigate([`/user/${this.userData.username}`])
  }
  
  //#region Initial and Default 
  private setDefault(){
    this.submitted = false;

    this.registerForm.setValue({
      firstName:'',  lastName:'', email:'',
      password:'', confirmPassword:''
    });
    this.loginForm.setValue({
      email:'', password:'',
    });

    this.setOTPFormDefault();
    this.setForgotFormDefault();
  }

  private setOTPFormDefault(){
    this.submitted = false;  
    let otpModel = { otp: null }
    this.otpForm.setValue(otpModel);
  }

  private setForgotFormDefault(){
    this.submitted = false;  
    let forgotModel = { email:'', otp: null, password:'', confirmPassword:'' }
    this.forgotForm.setValue(forgotModel);
  }

  private initializeForms() {
    this.registerForm = this.formBuilder.group({
      firstName: [''], 
      lastName: [''],
      email: ['', [Validators.required,Validators.pattern(Patterns.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });    

    this.loginForm = this.formBuilder.group({
      email:  ['', [Validators.required,Validators.pattern(Patterns.emailPattern)]],
      password: ['', [Validators.required,Validators.minLength(6)]],
    });

    this.otpForm = this.formBuilder.group({
      otp: [null, [Validators.required,Validators.minLength(6), Validators.maxLength(6)]]
    })
    
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.pattern(Patterns.emailPattern)]],
      otp: [null, [Validators.required,Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
//#endregion

//#region Message and Error 
  showMessage(message){
    this.message = message;
    setTimeout(() => {
      this.message= null;  
      this.isLoading = false;      
    }, 3000);
  }

  showError(errorMessage){
    this.error = errorMessage;
    setTimeout(() => {
      this.error= null;  
      //this.isLoading = false;     
    }, 2000);
  }
//#endregion

  ngOnDestroy(): void {
    if(this.launchLoginSub){
      this.launchLoginSub.unsubscribe();
    }
  }
}