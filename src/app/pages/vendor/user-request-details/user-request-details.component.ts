import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { VendorService } from 'src/app/services/vendor.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-user-request-details',
  templateUrl: './user-request-details.component.html',
  styles: [
  ]
})
export class UserRequestDetailsComponent implements OnInit {
  private routeSub:Subscription;

  userRequestForm: FormGroup; curRequestData; startupLink; requestId;
  isLoading = false; submitted = false;
    
  constructor(private route: ActivatedRoute, private router: Router,
    private formBuilder: FormBuilder, private vendorService:VendorService,
    private authService : AuthService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) {     
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.initializeForm();
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.startupLink = params['link'];
      this.requestId = params['id'];
      if(this.requestId)
        this.getRequestData(this.requestId);
    });     
  }

  ngOnInit(): void {
  }

  onAccept(){
    if(this.requestId == "" || this.requestId == null || this.requestId == undefined)
      return;

    if(confirm("Are you sure to accept user request?")) {
      this.isLoading = true; 
      this.vendorService.acceptRequest(this.requestId).subscribe(
        resData => {
          //console.log(resData);
          this.submitted = false;   
          this.initializeForm(); 
          this.isLoading = false; 
          this.toastrService.success("User rquest accepted successfully");
          this.router.navigate([`/vendor/requests/${this.startupLink}`]);
        },
        errorMessage => {
          this.isLoading = false; 
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }

  onDecline(){
    if(this.requestId == "" || this.requestId == null || this.requestId == undefined)
      return;

    if(confirm("Are you sure to decline user request?")) {
      this.isLoading = true; 
      this.vendorService.declineRequest(this.requestId).subscribe(
        resData => {
          //console.log(resData);
          this.submitted = false;   
          this.initializeForm(); 
          this.isLoading = false; 
          this.toastrService.success("User rquest declined successfully");
          this.router.navigate([`/vendor/requests/${this.startupLink}`]);
        },
        errorMessage => {
          this.isLoading = false; 
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }

  getRequestData(requestId){
    this.isLoading = true; 
    this.vendorService.getRequest(requestId).subscribe(
      res => {
        this.curRequestData = res.data;
        // console.log(this.curRequestData);
        this.userRequestForm.patchValue({
          productName : this.curRequestData.startupId.productName,           
          username : this.curRequestData.betaUserId.username,  
          name : this.curRequestData.betaReqAdminId.name,  
          email : this.curRequestData.betaReqAdminId.email,
          companyName: this.curRequestData.betaReqAdminId.companyName,
          companyWebsite:  this.curRequestData.betaReqAdminId.companyWebsite,
          companyDesignation: this.curRequestData.betaReqAdminId.companyDesignation,
          notes: this.curRequestData.betaReqAdminId.notes,
          introDetails: this.curRequestData.betaReqAdminId.introDetails,
          twitterUsername: this.curRequestData.betaReqAdminId.twitterUsername,
          linkedinUsername: this.curRequestData.betaReqAdminId.linkedinUsername
        });  
      this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }

  private initializeForm() {    
    this.userRequestForm = this.formBuilder.group({
      productName: new FormControl({value: '', disabled: true}),
      username: new FormControl({value: '', disabled: true}),
      name:  new FormControl({value: '', disabled: true}),
      email: new FormControl({value: '', disabled: true}),
      companyName: new FormControl({value: '', disabled: true}),
      companyWebsite:  new FormControl({value: '', disabled: true}),
      companyDesignation: new FormControl({value: '', disabled: true}),
      notes: new FormControl({value: '', disabled: true}),
      introDetails: new FormControl({value: '', disabled: true}),
      twitterUsername: new FormControl({value: '', disabled: true}),
      linkedinUsername: new FormControl({value: '', disabled: true})
    });
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
