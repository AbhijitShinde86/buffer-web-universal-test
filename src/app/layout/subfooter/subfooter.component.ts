import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';


import { Patterns } from '../../utilities/patterns';
import { SendInBlueService } from 'src/app/services/sendinblue.service';

@Component({
  selector: 'app-subfooter',
  templateUrl: './subfooter.component.html',
  styles: [
  ]
})
export class SubfooterComponent implements OnInit {

  isLoading = false; submitted = false; 
  subscribeForm: FormGroup; private submitReleaseTimer: any;

  constructor(private formBuilder: FormBuilder, private sendInBlueService: SendInBlueService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  get f() { return this.subscribeForm.controls; }  

  onSubmit(){
    this.submitted = true;
    if (this.subscribeForm.valid) {
      if(confirm("Are you sure to subscribe?")) {
        this.isLoading = true;         
        
        this.sendInBlueService.addSubscribeEmail(this.subscribeForm.value).subscribe(
          resData => {
            // console.log(resData);  
            this.isLoading = false; this.submitted = false; 
            this.initializeForm();
            this.toastrService.success("Email subscribe successfully");
          },
          errorMessage => {
            // console.log(errorMessage.error);
            this.isLoading = false; this.submitted = false; 
            if( errorMessage.error.code == 'duplicate_parameter'){              
              this.toastrService.success("Email subscribe successfully");
              this.initializeForm();
            }else{
              this.toastrService.error('An unknown error occurred!');
            }
          }  
        );
      }
    }
    else{
      this.submitReleaseTimer = setTimeout(() => {
        this.submitted = false;
      }, 1500);
      return;
    }
  }

  private initializeForm() {
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Patterns.emailPattern)]]
    });
  }
}
