import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import Quill from 'quill';
// import 'quill-emoji/dist/quill-emoji.js';

import { QuillConfig } from '../../../utilities/quill-config'
import { BetaHomeService } from 'src/app/services/beta_home.service';
import { StartupService } from 'src/app/services/startup.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from 'src/app/services/windowRef.service';

@Component({
  selector: 'app-startup-edit',
  templateUrl: './startup-edit.component.html',
  styles: [
  ]
})
export class StartupEditComponent implements OnInit {
  private routeSub:Subscription;
  private itemSub: Subscription;

  @ViewChild('imageFile') imageFile: any; 
  quillConfig:any; html:any;
  startupLink:string; startup: any; isLoading = false; submitted = false;  
  marketsList =[]; productForm: FormGroup; images = []; oldImages = []; 

  isBrowser;

  constructor(private route: ActivatedRoute, private router:Router,
    private betaHomeService:BetaHomeService,private authService : AuthService,
    private formBuilder: FormBuilder, private stratupService: StartupService,
    private toastrService:ShowToasterService, @Inject(PLATFORM_ID) private platformId: any, 
    private windowRefService: WindowRefService
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.quillConfig = QuillConfig.getQuillConfig();

    // const icons = Quill.import('ui/icons');
    // icons['undo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>' +
    //   '<path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>';
    // icons['redo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>' +
    //   '<path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>'; 
        
    this.initializeForm();
    this.getMarkets(); 
    this.routeSub = this.route.params.subscribe((params: Params) => {      
      this.startupLink = params['link'];
        if(this.startupLink)
          this.getStartupData();
    });   
  }

  ngOnInit(): void {
  }


  get f() { return this.productForm.controls; }  

  onSubmit(){
    this.submitted = true;
    if (!this.productForm.valid) {
      return;
    }

    if(this.f.images?.value?.length <= 0) return;
    if(this.f.images?.value?.length > 4) return;
    
    if(confirm("Are you sure to update product?")) {
      this.isLoading = true; 
      this.stratupService.updateStartup(this.startup._id, this.productForm.value,this.oldImages).subscribe(
        resData => {
          //console.log(resData);  
          this.isLoading = false; 
          this.toastrService.success("Startup updated successfully");
          this.router.navigate([`${environment.betaBaseUrl}/vendor/products`]);
        },
        errorMessage => {
          this.isLoading = false; 
          this.toastrService.error(errorMessage);
        }  
      );
    }
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

  removeOldImage(i,status){   
		this.oldImages[i].isRemoved = true;
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
      prodcutStatus: ['', [Validators.required]],
      markets: ['', [Validators.required]],
      imagePaths: ['', [Validators.required]],
      images: imagesData,
      offers: [''],
      founderNote: ['']
    });
  }
  
  getStartupData(){
    this.startup = null;
    this.isLoading = true; 
    this.itemSub = this.betaHomeService.getStartUpByLink(this.startupLink).subscribe(
      res => {
        if(res.data?.length > 0){          
          this.startup = res.data[0];    
          this.startup.imagePaths.forEach(filePath => {
            filePath.isRemoved =  false;
            filePath.url = filePath.url_preview;
            this.oldImages.push(filePath); 
          });  
          this.productForm.setValue({
            productName : this.startup.productName ?? '',
            shortDesc: this.startup.shortDesc ?? '',
            websiteUrl: this.startup.websiteUrl ?? '',
            description: this.startup.description ?? '',
            facebookUrl: this.startup.facebookUrl ?? '',
            twitterUrl: this.startup.twitterUrl ?? '',
            linkedinUrl: this.startup.linkedinUrl ?? '',
            prodcutStatus: this.startup.prodcutStatus ?? '',
            markets: this.startup.markets[0]._id ?? '',
            offers:this.startup.offers ?? '',     
            founderNote:this.startup.founderNote ?? '',
            imagePaths: '', images: []
          });        
        }    
        // console.log(this.startup);
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false; }
    )
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
  
  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
    if(this.itemSub){
      this.itemSub.unsubscribe();
    }    
  }
}
