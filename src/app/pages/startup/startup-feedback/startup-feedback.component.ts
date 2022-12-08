import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { StartupService } from 'src/app/services/startup.service';
import { WindowRefService } from 'src/app/services/windowRef.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-startup-feedback',
  templateUrl: './startup-feedback.component.html',
  styles: [
  ]
})
export class StartupFeedbackComponent implements OnInit {
  private userSub:Subscription;
  private routeSub:Subscription;
  private itemSub: Subscription;

  startupLink:string; startup: any;
  isLoading = false; user:User; 
  feedbackForm: FormGroup; submitted = false;  
  feedbackRating = 0;
  impressionText =''; impressionRating = 0;
  useCasesText =''; useCasesRating = 0;
  featuresText =''; featuresRating = 0;
  integrationText =''; integrationRating = 0;
  designText =''; designRating = 0;

  constructor(private betaHomeService:BetaHomeService, private startupService: StartupService,
    private route: ActivatedRoute, private router:Router,
    private formBuilder: FormBuilder, private authService : AuthService, 
    private toastrService:ShowToasterService, private windowRefService: WindowRefService) { 
      if(!this.authService.checkIsStillLogged()){
        this.authService.logout();
        this.windowRefService.nativeWindow.location.reload();
      }
      this.userSub = this.authService.user.subscribe(user => {
        if(!!user){
          this.user = user;
        }
      });
      this.routeSub = this.route.params.subscribe((params: Params) => {
        this.startupLink = params['link'];
        if(this.startupLink)
          this.getStartupData();
        else
          this.router.navigate([`${environment.betaBaseUrl}/`]);
      });
    }

  ngOnInit(): void {
    this.initializeForm();
  }

  getStartupData(){
    this.startup = null; 
    this.isLoading = true; 
    this.itemSub = this.betaHomeService.getStartUpByLink(this.startupLink).subscribe(
      res => {
        if(res.data?.length > 0){ 
          if(!(res.data[0]?.requestCount > 0 && res.data[0]?.requestFilter[0].reqStatus == 'APV'))
            this.router.navigate([`${environment.betaBaseUrl}/`]);   
          this.startup = res.data[0];   
        } 
        else
          this.router.navigate([`${environment.betaBaseUrl}/`]);   
        
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  }
    )
  }
  
  get f() { return this.feedbackForm.controls; }  

  onImpressionSave(){
    if(this.impressionText != "" && this.impressionText != undefined && this.impressionText != null
    && this.impressionRating != 0 && this.impressionRating != undefined && this.impressionRating != null){ 
      this.setControlValue('impressionText',this.impressionText);
      this.setControlValue('impressionRating',this.impressionRating);
      this.calculatefeedbackRating();
      this.toastrService.success("First impression feedback saved.")
    }
  }

  onUseCasesSave(){
    if(this.useCasesText != "" && this.useCasesText != undefined && this.useCasesText != null
    && this.useCasesRating != 0 && this.useCasesRating != undefined && this.useCasesRating != null){ 
      this.setControlValue('useCasesText',this.useCasesText);
      this.setControlValue('useCasesRating',this.useCasesRating);
      this.calculatefeedbackRating();
      this.toastrService.success("Use cases feedback saved.")
    }
  }

  onFeaturesSave(){
    if(this.featuresText != "" && this.featuresText != undefined && this.featuresText != null
    && this.featuresRating != 0 && this.featuresRating != undefined && this.featuresRating != null){ 
      this.setControlValue('featuresText',this.featuresText);
      this.setControlValue('featuresRating',this.featuresRating);
      this.calculatefeedbackRating();
      this.toastrService.success("Features feedback saved.")
    }
  }

  onIntegrationSave(){
    if(this.integrationText != "" && this.integrationText != undefined && this.integrationText != null
    && this.integrationRating != 0 && this.integrationRating != undefined && this.integrationRating != null){ 
      this.setControlValue('integrationText',this.integrationText);
      this.setControlValue('integrationRating',this.integrationRating);
      this.calculatefeedbackRating();
      this.toastrService.success("Integration feedback saved.")
    }
  }

  onDesignSave(){
    if(this.designText != "" && this.designText != undefined && this.designText != null
    && this.designRating != 0 && this.designRating != undefined && this.designRating != null){ 
      this.setControlValue('designText',this.designText);
      this.setControlValue('designRating',this.designRating);
      this.calculatefeedbackRating();
      this.toastrService.success("Ease Of use, UoI/UX design feedback saved.")
    }
  }

  onSubmit(){
    this.submitted = true;
    // console.log(this.f);
    if (!this.feedbackForm.valid) {
      return;
    }
    const feedback = {
      startupId :this.startup._id,
      feedbackRating:this.feedbackForm.value.feedbackRating,

      impressionText:this.feedbackForm.value.impressionText,
      impressionRating:this.feedbackForm.value.impressionRating,
      useCasesText:this.feedbackForm.value.useCasesText,
      useCasesRating:this.feedbackForm.value.useCasesRating,
      featuresText:this.feedbackForm.value.featuresText,
      featuresRating:this.feedbackForm.value.featuresRating,
      integrationText:this.feedbackForm.value.integrationText,
      integrationRating:this.feedbackForm.value.integrationRating,
      designText:this.feedbackForm.value.designText,
      designRating:this.feedbackForm.value.designRating
    }

    if(confirm("Are you sure to submit feedback?")) {
      this.isLoading = true; 
      this.startupService.addFeedback(feedback).subscribe(
        resData => {
          //console.log(resData);
          this.submitted = false;   
          this.initializeForm();   
          this.feedbackForm.reset();
          this.isLoading = false; 
          this.toastrService.success("Feedback Submitted Successfully");
          this.router.navigate([`${environment.betaBaseUrl}/${this.startup?.startupLink}`]);
        },
        errorMessage => {
          this.isLoading = false; 
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }

  calculatefeedbackRating(){
    const totalRating = ( this.impressionRating + this.useCasesRating + 
      this.featuresRating + this.integrationRating + this.designRating
    );
    this.feedbackRating = (totalRating/5);
    this.setControlValue('feedbackRating',this.feedbackRating);
  }

  setControlValue(cName, value){
    this.f[cName].setValue(value);
  }

  getControlValue(cName){
    return this.f[cName].value;
  }

  onStartupClick(startupLink){
    this.router.navigate([`${environment.betaBaseUrl}/${startupLink}`]);
  }

  private initializeForm() {
    this.feedbackForm = this.formBuilder.group({
      feedbackRating: [0, [Validators.required]],
      impressionText: ['', [Validators.required]],
      impressionRating: [0, [Validators.required]],
      useCasesText: ['', [Validators.required]],
      useCasesRating: [0, [Validators.required]],
      featuresText: ['', [Validators.required]],
      featuresRating: [0, [Validators.required]],
      integrationText: ['', [Validators.required]],
      integrationRating: [0, [Validators.required]],
      designText: ['', [Validators.required]],
      designRating: [0, [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.itemSub){
      this.itemSub.unsubscribe();
    }    
  }
}
