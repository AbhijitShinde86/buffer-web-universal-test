import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {
  private userSub: Subscription;

  @ViewChild('photoFile') photoFile: any; 
  
  imageSrc= null; isFirstSelection=true; isDeleteImage=false;
  userForm: FormGroup; isLoading = false; submitted = false;
  curUserData; user:User;

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
        this.getUserData();
      }
    });
  }

  ngOnInit(): void {
  }

  getUserData(){
    this.isLoading = true; 
    this.userService.getUser(this.user.id).subscribe(
      res => {
        this.curUserData = res.data;
        // console.log(this.curUserData);  
   
        if(this.curUserData?.photoUrl != '' && this.curUserData?.photoUrl != undefined &&  this.curUserData?.photoUrl != null)
          this.imageSrc = this.curUserData?.photoUrl?.url_preview;

        const companyName = this.curUserData?.companyName;
        const companyWebsite = this.curUserData?.companyWebsite;

        this.userForm.patchValue({
          firstName : this.curUserData?.firstName,           
          lastName : this.curUserData?.lastName,  
          email : this.curUserData?.email,  
          username : this.curUserData?.username,  
          companyName : companyName == "undefined" ? '' : companyName == "null" ? '' : companyName,  
          companyWebsite : companyWebsite == "undefined" ? '' : companyWebsite == "null" ? '' : companyWebsite
        });  
      this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }

  get uF() { return this.userForm.controls; }  

  onSubmit(){
    this.submitted = true;  

    if(!this.userForm.valid)
      return;
    // console.log(this.userForm.value);

    if(confirm("Are you sure to update user details?")) {
      this.isLoading = true; 
      this.userService.updateUser(this.user.id, this.userForm.value,this.isDeleteImage).subscribe(
        resData => {
          //console.log(resData);
          this.submitted = false;   
          this.isLoading = false; 
          this.toastrService.success("User details updated successfully");
          this.initializeForm();   
          this.userForm.reset();
          this.windowRefService.nativeWindow.location.reload();
        },
        errorMessage => {
          this.isLoading = false; 
          this.toastrService.error(errorMessage);
        }        
      );
    }
  }
  
  onFileChange(event) {
    if(this.isFirstSelection && this.imageSrc){
      this.isDeleteImage = true;
      this.isFirstSelection = false;
    }
    let files = event.target.files;
    this.imageSrc = null;
    this.removeImage(0);
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result; 
          this.photos.push(this.createItem({
              file,
              url: e.target.result  //Base64 string for preview image
          }));
        }
        reader.readAsDataURL(file);
      }
    }
    this.photoFile.nativeElement.value = '';
  }
  
  createItem(data): FormGroup {
    return this.formBuilder.group(data);
  }
  
  get photos(): FormArray {
    return this.userForm.get('images') as FormArray;
  };

  removeImage(i){   
    (this.userForm.get('images') as FormArray).removeAt(i);
    this.imageSrc = null;
  } 
  
  removeOldImage(i){
    this.isDeleteImage = true;
    this.removeImage(i)
    this.photoFile.nativeElement.value = '';
  }
 
  private initializeForm() {    
    let imagesData = new FormArray([]);
    this.userForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: new FormControl({value: '', disabled: true}),
      username:['', Validators.required],
      companyName: [''],
      companyWebsite:  [''],
      photoUrl: [''],
      images: imagesData
    });
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
