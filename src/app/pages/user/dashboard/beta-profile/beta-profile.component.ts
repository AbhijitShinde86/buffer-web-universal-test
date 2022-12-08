import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-beta-profile',
  templateUrl: './beta-profile.component.html',
  styles: [
  ]
})
export class BetaProfileComponent implements OnInit {
  private userSub: Subscription;
  
  requestForm: FormGroup; requestData; user:User;
  isLoading = false; submitted = false;
  
  constructor(private formBuilder: FormBuilder,
    private userService:UserService, private authService: AuthService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) {     
    this.initializeForm(); 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        this.getUserBetaData();
      }
    });
  }

  ngOnInit(): void {
  }

  getUserBetaData(){
    this.isLoading = true; 
    this.userService.getUserBetaProfile(this.user.id).subscribe(
      res => {
        this.requestData = res.data.length > 0 ? res.data[0] : null;
        // console.log(this.requestData);  
        if(this.requestData){
          this.requestForm.patchValue({
            id : this.requestData?._id,
            name: this.requestData?.name,
            email: this.requestData?.email,
            companyWebsite: this.requestData?.companyWebsite,
            introDetails: this.requestData?.introDetails,
            companyName: this.requestData?.companyName,
            companyDesignation: this.requestData?.companyDesignation,
            notes: this.requestData?.notes,
            twitterUsername: this.requestData?.twitterUsername,
            linkedinUsername: this.requestData?.linkedinUsername
  
          });  
        }
      this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }

  get uF() { return this.requestForm.controls; }  

  onSubmit(){
    this.submitted = true;  

    if(!this.requestForm.valid)
      return;
    // console.log(this.requestForm.value);

    const requestId = this.requestForm.get('id').value;
    if(requestId == undefined || requestId == null || requestId == "" )
      return;

    const request = {
      name: this.requestForm.get('name').value,
      email: this.requestForm.get('email').value,
      companyName: this.requestForm.value.companyName,
      companyWebsite: this.requestForm.value.companyWebsite,
      companyDesignation: this.requestForm.value.companyDesignation,
      notes: this.requestForm.value.notes,
      introDetails: this.requestForm.value.introDetails,
      twitterUsername: this.requestForm.value.twitterUsername,
      linkedinUsername: this.requestForm.value.linkedinUsername
    }
    
    if(confirm("Are you sure to update beta profile?")) {
      this.isLoading = true; 
      this.userService.updateUserBetaProfile(requestId, request).subscribe(
        resData => {
          //console.log(resData);
          this.submitted = false;   
          this.initializeForm();   
          this.requestForm.reset();
          this.isLoading = false; 
          this.toastrService.success("Beta profile updated successfully");
          this.windowRefService.nativeWindow.location.reload();
        },
        errorMessage => {
          this.isLoading = false; 
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }
  
  private initializeForm() {    
    let imagesData = new FormArray([]);
    this.requestForm = this.formBuilder.group({
      id: new FormControl({value: '', disabled: true}),      
      name: new FormControl({value: '', disabled: true}),
      email: new FormControl({value: '', disabled: true}),
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
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
