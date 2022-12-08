import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import Quill from 'quill';
// import 'quill-emoji/dist/quill-emoji.js';

import { QuillConfig } from '../../../utilities/quill-config'

import { StartupService } from 'src/app/services/startup.service';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';
import { SendInBlueService } from 'src/app/services/sendinblue.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-startup-new',
  templateUrl: './startup-new.component.html',
  styles: [
  ]
})
export class StartupNewComponent implements OnInit {
  @ViewChild('imageFile') imageFile: any; 
  private userSub:Subscription;

  curStep=1; isLoading = false;  user:User; 
  quillConfig:any; html:any; intervalId:any; isIntervalLaunched = false;
  nextPressed = false; submitted = false; 
  marketsList =[]; productForm: FormGroup; images = []; 

  isBrowser;

  constructor(private formBuilder: FormBuilder, private stratupService: StartupService, 
    private authService : AuthService, private router:Router, private sendInBlueService: SendInBlueService,
    private toastrService:ToastrService, @Inject(PLATFORM_ID) private platformId: any
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
    this.getMarkets();
    if(this.user){
      this.isIntervalLaunched = true;
    }
    else{
      this.intervalId = setInterval(() => {
        if(!this.isIntervalLaunched){
          this.isIntervalLaunched = true;
          clearInterval(this.intervalId);
          this.authService.setLaunchLogin({ action:"New startup page" });
        }
      }, 5000);
    }
  }
  
  getMarkets(){
    this.stratupService.getMarkets().subscribe(
      res => {
          this.marketsList = res.data;
          if(this.marketsList.length > 0){
            this.productForm.get('markets').setValue(this.marketsList[0]._id);
          }
          // console.log(this.marketsList)
      },
      errorMessage => { this.toastrService.error(errorMessage); }
    );    
  }
  
  get f() { return this.productForm.controls; }  

  onSubmit(){
    this.submitted = true;
    if(this.curStep == 1){
      if (!this.productForm.valid) {
        return;
      }
      this.curStep = 2;
    }else{
      const prodcutStatus = this.productForm.get('prodcutStatus').value;
      if(prodcutStatus == "" || prodcutStatus ==  null || prodcutStatus == undefined){
        this.productForm.get('prodcutStatus').setErrors({ required : true });
        return;
      }
      
      const markets = this.productForm.get('markets').value;
      if(markets == "" || markets ==  null || markets == undefined){
        this.productForm.get('markets').setErrors({ required : true });
        return;
      }

      const imagePaths = this.productForm.get('imagePaths').value;
      if(imagePaths == "" || imagePaths ==  null || imagePaths == undefined){
        this.productForm.get('imagePaths').setErrors({ required : true });
        return;
      }
      
      if(this.f.images?.value?.length <= 0) return;
      if(this.f.images?.value?.length > 4) return;
      
      if(this.user){
        if(confirm("Are you sure to create new product?")) {
          this.isLoading = true; 
          this.stratupService.addStartup(this.productForm.value).subscribe(
            resData => {
              //console.log(resData);  
              this.sendInBlueService.addVendorEmail(this.user?.email).subscribe(
                resData => { // console.log(resData);  
                },
                errorMessage => { // console.log(errorMessage.error);
                }  
              );
              this.isLoading = false; 
              this.toastrService.success("New startup created successfully");
              this.router.navigate([`${environment.betaBaseUrl}/thankyou`]);
            },
            errorMessage => {
              this.isLoading = false; 
              this.toastrService.error(errorMessage);
            }  
          );
        }
      }
      else{
        this.authService.setLaunchLogin({action:"New startup page", blockReloadPage : true});
      }
    }
  }

  onPreviousClick(){
    // console.log("this.logoSrc : ", this.logoSrc);
    this.curStep = 1;
  }

  
  onFileChange(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          const newImage = { url : e.target.result}
          this.images.push(newImage); 
          this.photos.push(this.createItem({
              file,
              url: e.target.result  //Base64 string for preview image
          }));
        }
        reader.readAsDataURL(file);
      }
    }
    this.imageFile.nativeElement.value = '';
  }

  createItem(data): FormGroup {
    return this.formBuilder.group(data);
  }
  
  get photos(): FormArray {
    return this.productForm.get('images') as FormArray;
  };

  removeImage(i,status){   
		(this.productForm.get('images') as FormArray).removeAt(i);
    this.images.splice(i, 1)
	}   

  private initializeForm() {
    let imagesData = new FormArray([]);
    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required]],
      shortDesc: ['', [Validators.required]],
      websiteUrl: ['', [Validators.required,Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")]],
      description: ['', [Validators.required]],
      facebookUrl: [''],
      twitterUrl: [''],
      linkedinUrl: [''],
      prodcutStatus: ['RL'],
      markets: [''],
      imagePaths: [''],
      images: imagesData,
      offers: [''],
      founderNote: ['']
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
