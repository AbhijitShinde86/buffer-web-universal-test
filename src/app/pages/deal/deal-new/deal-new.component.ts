import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
;
import { ToastrService } from 'ngx-toastr';
// import Quill from 'quill';
// import 'quill-emoji/dist/quill-emoji.js';
import { QuillConfig } from '../../../utilities/quill-config'

import { DealService } from 'src/app/services/deal.service';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-deal-new',
  templateUrl: './deal-new.component.html',
  styles: [
  ]
})
export class DealNewComponent implements OnInit {
  private userSub:Subscription;

  isLoading = false; user:User; quillConfig; html; 
  intervalId ; isIntervalLaunched = false;
  submitted = false; productForm: FormGroup; 
  isBrowser;

  constructor(private formBuilder: FormBuilder, private dealService: DealService, 
    private authService : AuthService, private router:Router, 
    private toastrService:ToastrService, @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
      this.userSub = this.authService.user.subscribe(user => {
        if(!!user){
          this.user = user;
        }
      });
      this.quillConfig = QuillConfig.getQuillConfig();

      // const icons = Quill.import('ui/icons');
      // icons['undo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>' +
      //   '<path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>';
      // icons['redo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>' +
      //   '<path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>';        
  }

  ngOnInit(): void {
    this.initializeForm();
    if(this.user){
      this.isIntervalLaunched = true;
    }
    else{
      this.intervalId = setInterval(() => {
        if(!this.isIntervalLaunched){
          this.isIntervalLaunched = true;
          clearInterval(this.intervalId);
          this.authService.setLaunchLogin({ action:"ngOnit - New deal page" });
        }
      }, 5000);
    }
  }
    
  get f() { return this.productForm.controls; }  

  onSubmit(){
    this.submitted = true;

    if (!this.productForm.valid) {
      return;
    }

    if(this.user){
      if(confirm("Are you sure to create new deal?")) {
        this.isLoading = true; 
        this.dealService.addDealRequest(this.productForm.value).subscribe(
          resData => {
            //console.log(resData);  
            this.isLoading = false; 
            this.toastrService.success("New deal created successfully");
            this.router.navigate([`${environment.dealsBaseUrl}/thankyou`]);
          },
          errorMessage => {
            this.isLoading = false; 
            this.toastrService.error(errorMessage);
          }  
        );
      }
    }
    else{
      this.authService.setLaunchLogin({action:"Submit - New Deal page", blockReloadPage : true});
    }
  }

  private initializeForm() {
    this.productForm = this.formBuilder.group({
      dealName: ['', [Validators.required]],
      shortDesc: ['', [Validators.required]],
      websiteUrl: ['', [Validators.required,Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")]],
      description: ['', [Validators.required]],
      facebookUrl: [''],
      twitterUrl: [''],
      linkedinUrl: ['']
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.authService.setLaunchLogin(null);

    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
