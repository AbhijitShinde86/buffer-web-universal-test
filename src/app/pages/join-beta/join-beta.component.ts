import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { StartupService } from 'src/app/services/startup.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { UrlService } from 'src/app/shared/url.service';
import { Patterns } from 'src/app/utilities/patterns';

@Component({
  selector: 'app-join-beta',
  templateUrl: './join-beta.component.html',
  styles: [
  ]
})
export class JoinBetaComponent implements OnInit {
  previousUrl: Observable<string> = this.urlService.previousUrl$;
  private userSub:Subscription;
  
  intervalId:any; isIntervalLaunched = false;
  isLoading = true; user:User; prevUrl; betaRequest = null;
  submitted = false; requestForm: FormGroup;  

  constructor(private authService : AuthService, private formBuilder: FormBuilder,
    private router:Router, private startupService: StartupService,
    private toastrService:ShowToasterService,
    private urlService: UrlService
  ) { 
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        this.getJoinBetaData();
      }
    });
  }

  ngOnInit(): void {
    this.urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.prevUrl= previousUrl;
    });
    this.initializeForm();
    if(this.user){
      this.isIntervalLaunched = true;
    }
    else{
      this.intervalId = setInterval(() => {
        if(!this.isIntervalLaunched){
          this.isIntervalLaunched = true;
          clearInterval(this.intervalId);
          this.authService.setLaunchLogin({ action:"Join beta page" });
        }
      }, 5000);
    }
  }

  getJoinBetaData(){
    this.isLoading = true; 
    this.startupService.getJoinBetaData().subscribe(
      res => {
        this.betaRequest = res.data;
        if(this.betaRequest){
          this.requestForm.setValue({
            name: this.betaRequest?.name,
            email: this.betaRequest?.email,
            companyWebsite: this.betaRequest?.companyWebsite,
            introDetails: this.betaRequest?.introDetails,
            companyName: this.betaRequest?.companyName,
            companyDesignation: this.betaRequest?.companyDesignation,
            notes: this.betaRequest?.notes,
            twitterUsername: this.betaRequest?.twitterUsername,
            linkedinUsername: this.betaRequest?.linkedinUsername
          });
          this.requestForm.disable()
        }
        // console.log(this.betaRequest);  
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }
  
  get f() { return this.requestForm.controls; }  

  onSubmit(){
    this.submitted = true;
    if (!this.requestForm.valid) {
      return;
    }
    const request = {
      name: this.requestForm.value.name,
      email: this.requestForm.value.email,
      companyName: this.requestForm.value.companyName,
      companyWebsite: this.requestForm.value.companyWebsite,
      companyDesignation: this.requestForm.value.companyDesignation,
      notes: this.requestForm.value.notes,
      introDetails: this.requestForm.value.introDetails,
      twitterUsername: this.requestForm.value.twitterUsername,
      linkedinUsername: this.requestForm.value.linkedinUsername
    }

    if(this.user){
      if(confirm("Are you sure to raise join beta request?")) {
        this.isLoading = true; 
        this.startupService.joinBetaAdmin(request).subscribe(
          resData => {
            //console.log(resData);
            this.submitted = false;   
            this.initializeForm();   
            this.requestForm.reset();
            this.isLoading = false; 
            this.toastrService.success("Join beta request raised successfully");
            if(this.prevUrl)
              this.router.navigate([`${this.prevUrl}`]);
            else
              this.getJoinBetaData();
          },
          errorMessage => {
            this.isLoading = false; 
            this.toastrService.error(errorMessage);
          }        
        );
      }
    }
    else{
      this.authService.setLaunchLogin({action:"Join beta page", blockReloadPage : true});
    }
  }

  private initializeForm() {
    this.requestForm = this.formBuilder.group({
      name: [this.user?.name, [Validators.required]],
      email: [this.user?.email, [Validators.required, Validators.pattern(Patterns.emailPattern)]],
      companyWebsite: [''],
      introDetails: [''],
      companyName: [''],
      companyDesignation: [''],
      notes: [''],
      twitterUsername: [''],
      linkedinUsername: ['']
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.authService.setLaunchLogin(null);
    
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
