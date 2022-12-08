import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
;
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
// import Quill from 'quill';
// import 'quill-emoji/dist/quill-emoji.js';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { QuillConfig } from 'src/app/utilities/quill-config';
import { DealService } from 'src/app/services/deal.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-deal-content',
  templateUrl: './deal-content.component.html',
  styles: [
  ]
})
export class DealContentComponent implements OnInit {
  @ViewChild('imageFile') imageFile: any; 
  @ViewChild('headerImageFile') headerImageFile: any; 
  @ViewChild('horizontalImageFile') horizontalImageFile: any; 

  private userSub:Subscription;
  private routeSub:Subscription;
  private itemSub: Subscription;

  isLoading = false; isSpinnerLoading= false; user:User; dealLink:string; dealRequest:any;
  quillConfig:any; html:any; intervalId:any; isIntervalLaunched = false;
  nextPressed = false; submitted = false; productForm: FormGroup; 
  images = []; headerImages = []; horizontalImages = []; 
  
  isBrowser;

  constructor(private formBuilder: FormBuilder, private dealService: DealService, 
    private authService : AuthService, private router:Router, private route: ActivatedRoute,
    private toastrService:ToastrService, @Inject(PLATFORM_ID) private platformId
  ) {
      this.isBrowser = isPlatformBrowser(platformId);
      this.userSub = this.authService.user.subscribe(user => {
        if(!!user){
          this.user = user;
        }
      });

      this.routeSub = this.route.params.subscribe((params: Params) => {
        this.dealLink = params['link'];
        if(!this.dealLink)
          this.router.navigate([`${environment.dealsBaseUrl}/`]);
        else
          this.getDealRequestData();
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
          this.authService.setLaunchLogin({ action:"New startup page" });
        }
      }, 5000);
    }
  }

  get f() { return this.productForm.controls; }  

  onSubmit(){
    this.submitted = true; 
    if (!this.productForm.valid) return;
    if(this.f.images?.value?.length <= 0) return;
    if(this.f.images?.value?.length > 4) return;

    if(this.user){
      if(confirm("Are you sure to add vendor content?")) {
        this.isLoading = true; this.isSpinnerLoading = true; 
        this.dealService.addDealContent(this.dealRequest._id, this.productForm.value).subscribe(
          resData => {
            //console.log(resData);  
            this.isLoading = false; this.isSpinnerLoading = false; 
            this.toastrService.success("Vendor content added successfully");
            this.router.navigate([`${environment.dealsBaseUrl}`]);
          },
          errorMessage => {
            this.isLoading = false; this.isSpinnerLoading = false;
            this.toastrService.error(errorMessage);
          }  
        );
      }
    }
    else{
      this.authService.setLaunchLogin({action:"Add vendor content", blockReloadPage : true});
    }  
  }

  private initializeForm() {
    let headerImagesData = new FormArray([]);
    let horizontalImagesData = new FormArray([]);
    
    let imagesData = new FormArray([]);
    this.productForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required,Validators.email]],
      productName: ['', [Validators.required]],
      pronunciation: ['', [Validators.required]],
      productUrl: ['', [Validators.required,Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")]],
      pricingUrl: ['', [Validators.required,Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")]],
      
      palnReady: ['', [Validators.required]],
      isProductGDPR: ['', [Validators.required]],
      productMultiLang : ['', [Validators.required]],
      
      shortDesc: ['', [Validators.required]],
      header: ['', [Validators.required]],
      subHeader: ['', [Validators.required]],
      productSEOText: ['', [Validators.required]],

      headerImagePaths: ['', [Validators.required]],
      headerImages: headerImagesData,   
      horizontalImagePaths: ['', [Validators.required]],
      horizontalImages: horizontalImagesData,   
      isLogoMatch: ['', [Validators.required]],
      isLogoConfirm: ['', [Validators.required]],

      introduction: ['', [Validators.required]],
      taxonomy: ['', [Validators.required]],
      solutions: ['', [Validators.required]],
      
      description: ['', [Validators.required]],
      useCases: ['', [Validators.required]],
      features: ['', [Validators.required]],
      targetCustomer: ['', [Validators.required]],
      imagePaths: ['', [Validators.required]],
      images: imagesData
    });
  }
  
  getDealRequestData(){
    this.isLoading = true; 
    this.itemSub = this.dealService.getDealRequestByLink(this.dealLink).subscribe(
      res => {
        if(res.data?.length > 0){
          this.dealRequest = res.data[0];
          if(this.dealRequest.contentCount > 0)
            this.router.navigate([`${environment.dealsBaseUrl}/`]);  
        } 
        else
          this.router.navigate([`${environment.dealsBaseUrl}/`]);   
        
        console.log(this.dealRequest);
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  
        this.router.navigate([`${environment.dealsBaseUrl}/`]);   }
    )
  }

  // #region Images 
    
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

  createItem(data): FormGroup { return this.formBuilder.group(data); }
  
  get photos(): FormArray { return this.productForm.get('images') as FormArray; };

  removeImage(i,status){  (this.productForm.get('images') as FormArray).removeAt(i); this.images.splice(i, 1) }   

  // #endregion

  // #region Header Images 
    
  onFileChangeHeader(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          const newImage = { url : e.target.result}
          this.headerImages.push(newImage); 
          this.photosHeader.push(this.createItemHeader({
              file,
              url: e.target.result  //Base64 string for preview image
          }));
        }
        reader.readAsDataURL(file);
      }
    }
    this.headerImageFile.nativeElement.value = '';
  }

  createItemHeader(data): FormGroup { return this.formBuilder.group(data); }
  
  get photosHeader(): FormArray { return this.productForm.get('headerImages') as FormArray; };

  removeImageHeader(i,status){  (this.productForm.get('headerImages') as FormArray).removeAt(i); this.headerImages.splice(i, 1) }   

  // #endregion

  // #region Horizontal Images 
    
  onFileChangeHorizontal(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          const newImage = { url : e.target.result}
          this.horizontalImages.push(newImage); 
          this.photosHorizontal.push(this.createItemHorizontal({
              file,
              url: e.target.result  //Base64 string for preview image
          }));
        }
        reader.readAsDataURL(file);
      }
    }
    this.horizontalImageFile.nativeElement.value = '';
  }

  createItemHorizontal(data): FormGroup { return this.formBuilder.group(data); }
  
  get photosHorizontal(): FormArray { return this.productForm.get('horizontalImages') as FormArray; };

  removeImageHorizontal(i,status){  (this.productForm.get('horizontalImages') as FormArray).removeAt(i); this.horizontalImages.splice(i, 1) }   

  // #endregion

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.itemSub){
      this.itemSub.unsubscribe();
    }
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
