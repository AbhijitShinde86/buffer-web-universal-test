import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
;
// import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
import { UrlService } from 'src/app/shared/url.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deal-checkout',
  templateUrl: './deal-checkout.component.html',
  styles: [
  ]
})

export class DealCheckoutComponent implements OnInit {
  previousUrl: Observable<string> = this.urlService.previousUrl$;
  // @ViewChild(StripePaymentElementComponent) paymentElement: StripePaymentElementComponent;

  private userSub:Subscription;
  private checkoutSub:Subscription;
  appCurSign = environment.appCurSign;

  paymentFormLoaded = false; paymentData = null; stripeId:any;
  isLoading = true; user:User; balRewardAmt = 0; submitted = false; 
  deals = []; subTotal = 0; rewardAmt = 0; subDiscAmount=0;
  discAmt = 0; totalAmt = 0; cartPromo = null; selectedCard = null; prevUrl;
  client_secret=null; checkoutData = null;

  appearance: Appearance = {
    theme: 'stripe',
    labels: 'floating',
    variables: {
      colorPrimary: '#673ab7',
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  
  constructor(private router:Router, private authService:AuthService, private route: ActivatedRoute, 
    private cartService :CartService,
    //  private stripeService: StripeService, 
    private urlService: UrlService, private checkoutService:CheckoutService,
    private toastrService:ShowToasterService
  ) { 
    this.userSub = this.authService.user.subscribe(user => {
      if(!!user){
        this.user = user;
        this.getCartData();
      }
    });
    this.route.queryParams.subscribe(params => {
      this.client_secret = params['client_secret'];
    });
    this.checkoutSub = this.checkoutService.checkoutData.subscribe(data => {
      this.checkoutData = data;
    });

    if(this.client_secret == this.checkoutData?.client_secret){
      // console.log("client_secret : ",this.client_secret, " - checkoutData : ",this.checkoutData);
      this.loadStripePayment(this.checkoutData);
    }else{
      this.router.navigate([`${environment.dealsBaseUrl}`]);
    }

  }

  ngOnInit(): void { 
    this.urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.prevUrl= previousUrl;
    });   
  }

  loadStripePayment(data){
    this.paymentData = data;
    this.stripeId = data.customerId;
    this.elementsOptions.clientSecret = data.client_secret;
    this.paymentFormLoaded = true;
  }

  onPlaceOrder(){
    this.calculateAmounts();
    if(this.deals?.length > 0 && this.totalAmt > 0){      
      // // if(confirm("Are you sure to place order?")){
      //   this.isLoading = true; 
      //   this.stripeService.confirmPayment({
      //     elements: this.paymentElement.elements,
      //     confirmParams: {
      //       payment_method_data: {
      //         billing_details: {
      //           name: this.user.name,
      //           email: this.user.email
      //         },
      //       }
      //     },
      //     redirect: 'if_required',
      //   })
      //   .subscribe({
      //     next: (result) => {
      //       if (result.error) {
      //         this.isLoading = false; 
      //         if(result.error.type !== 'validation_error'){
      //           // console.log("result.error : ",result.error);
      //         }
      //         this.toastrService.error(result.error.message);
      //       } else if (result.paymentIntent.status === 'succeeded') {
      //         this.isLoading = false; 
      //         // console.log("result : ", result);
      //         // console.log("Payment completed");
      //         this.cartService.setPaymentCompleted(this.paymentData?.orderId).subscribe(
      //           res => {
      //             this.createOrder(this.paymentData, result.paymentIntent);    
      //           },
      //           errorMessage => {
      //             this.toastrService.error(errorMessage);
      //           }        
      //         );
      //       }
      //     },
      //     error: (errorMessage) => {
      //       this.isLoading = false; 
      //       // console.log("errorMessage : ",errorMessage);
      //       this.toastrService.error(errorMessage);
      //     },
      //   });
      // // }
    }
  }

  createOrder(paymentData, paymentIntent){
    this.calculateAmounts();
    const userId = this.user.id;
    const name = this.user.name;
    const email = this.user.email;
    const cartDelas = this.deals;
    const cartAmounts = {
      subTotalAmount : this.subTotal, 
      subDiscAmount : this.subDiscAmount,
      rewardAmount: this.rewardAmt,  
      couponAmount: this.discAmt,
      totalAmount: this.totalAmt
    };
    const transData = {
      client_secret: paymentData?.client_secret, 
      paymentIntentId: paymentData?.paymentIntentId, 
      customerId: paymentData?.customerId, 
      orderId:paymentData?.orderId,
      paymentMethodId: paymentIntent?.payment_method,
      totalAmount:paymentData?.totalAmount, 
      currency:paymentData?.currency, 
      exchangeRate:paymentData?.exchangeRate, 
      paymentAmount:paymentData?.paymentAmount
    }
    const cartCoupon = this.cartPromo;         
    const orderRequest = { userId, name, email, cartDelas, cartAmounts, cartCoupon, transData, isRewardsOrder: false };
    // console.log("orderRequest : ", orderRequest);
    
    this.isLoading = true; 
    this.cartService.createOrder(orderRequest)
    .subscribe(
      resData => {
        // console.log(resData);
        this.isLoading = false;
        
        this.setCartCount(0);
        this.router.navigate([`${environment.dealsBaseUrl}/purchase-thankyou`]);         
      },
      errorMessage => {
        this.isLoading = false;
        
        this.toastrService.error(errorMessage);
      }        
    );
  
  }

  getCartData(){
    this.isLoading = true; 
    this.cartService.getCart().subscribe(
      res => {
        this.deals = res.data;
        this.setCartCount(this.deals.length);
        if(this.deals.length > 0){
          this.balRewardAmt = this.deals[0].balRewardAmt;          
          this.stripeId = this.deals[0].stripeId;
          const countryId = this.deals[0]?.countryId;  
          const countryCode2D= this.deals[0]?.countryCode2D;  
          const currencyCode= this.deals[0]?.currencyCode;  

          //console.log("countryId : ",countryId); console.log("countryCode2D : ",countryCode2D); console.log("currencyCode : ",currencyCode);

          if(countryId && countryCode2D && currencyCode ){            
            this.calculateAmounts();
            // if(this.totalAmt > 0){
            //   this.createPaymentIntent(this.totalAmt, countryCode2D, currencyCode);
            // }
          }else{
            this.router.navigate([`${environment.dealsBaseUrl}/cart`]);
          }
        } 
        else{
          this.router.navigate([`${environment.dealsBaseUrl}`]);
        }
        // console.log(this.deals);
        this.isLoading = false; 
    },
      errorMessage => { this.isLoading = false;  }
    )
  }

  getLastFourDigit(cardNo){
    if( cardNo.length > 3 ) {
      return cardNo.substr(cardNo.length - 4);
    }
    return cardNo;
  }

  calculateAmounts(){
    this.subTotal = 0; this.discAmt = 0; this.totalAmt = 0, 
    this.subDiscAmount =0; this.rewardAmt = 0; 
    
    const calItemTotal = this.deals.reduce(function(sum, current) {
      const calAmount = (+current.discPrice * + current.quantity);
      return sum + calAmount;
    }, 0);

    const calItemDiscTotal = this.deals.reduce(function(sum, current) {
      const calAmount = (+current.discAmount * + current.quantity);
      return sum + calAmount;
    }, 0);

    this.subDiscAmount = calItemDiscTotal;
    
    this.discAmt = this.cartPromo?.amount == undefined ? 0 : this.cartPromo?.amount;

    this.subTotal = calItemTotal; 
    this.rewardAmt =this.balRewardAmt;
    if(this.balRewardAmt > 0 && this.balRewardAmt >= this.subTotal){
      this.rewardAmt = this.subTotal - 1;
    }   

    this.totalAmt = (( +this.subTotal - +this.rewardAmt ) - +this.discAmt );
  }

  setCartCount(ccnt:Number) {
    const updatedUser = { ...this.user, ccnt: ccnt };
    this.authService.updateCartCount(ccnt, updatedUser);
  }

  onGoBack(){
    if(this.prevUrl)
      this.router.navigate([`${this.prevUrl}`]);
    else
      this.router.navigate([`${environment.dealsBaseUrl}/cart`]);
  }

  // createPaymentIntent(amount:Number,countryCode2D:string, currencyCode:string){
  //   this.paymentFormLoaded = false;
  //   this.isLoading = true; 
  //   this.cartService
  //   .createPaymentIntent({
  //     userId: this.user.id,
  //     name: this.user.name, 
  //     email: this.user.email,
  //     amount: amount,
  //     country:countryCode2D,
  //     currency:currencyCode,
  //     stripeId: this.stripeId
  //   }).subscribe(
  //     resData => {
  //       // console.log(resData);
  //       this.loadStripePayment(resData.data);
  //       this.isLoading = false;
  //           
  //       this.paymentFormLoaded = true;   
  //     },
  //     errorMessage => {
  //       this.isLoading = false;
  //       
  //       this.paymentFormLoaded = true;
  //       this.toastrService.error(errorMessage);
  //     }  
  //   );
  // }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.checkoutSub){
      this.checkoutSub.unsubscribe();
    }
  }
}


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// ;
// import { Subscription } from 'rxjs';
// import * as cardValidator from "card-validator";
// import { loadStripe } from '@stripe/stripe-js';

// import { AuthService } from 'src/app/auth/auth.service';
// import { User } from 'src/app/auth/user.model';
// import { CartService } from 'src/app/services/cart.service';
// import { ShowToasterService } from 'src/app/shared/show-toaster-service.service';
// import { environment } from 'src/environments/environment';
// import { Patterns } from '../../../utilities/patterns';

// @Component({
//   selector: 'app-deal-checkout',
//   templateUrl: './deal-checkout.component.html',
//   styles: [
//   ]
// })
// export class DealCheckoutComponent implements OnInit {
//   private userSub:Subscription;
//   appCurSign = environment.appCurSign;

//   isLoading = true; user:User; stripe; balRewardAmt = 0; 
//   creditCardModalDisplay = 'none'; cardForm: FormGroup; submitted = false; 
//   deals = []; cards = []; subTotal = 0; rewardAmt = 0; subDiscAmount=0;
//   discAmt = 0; totalAmt = 0; cartPromo = null; selectedCard = null; 

//   public maxLength: number;
//   public maxCvvLength: number;
//   public validationRes;
//   public imask = {mask:'0000'};


//   constructor(private router:Router, private authService:AuthService,
//     private cartService :CartService, private formBuilder: FormBuilder,
//     private toastrService:ShowToasterService
//   ) { 
//     this.maxLength = 255;
//     this.userSub = this.authService.user.subscribe(user => {
//       if(!!user){
//         this.user = user;
//         this.getCartData();
//         this.getUserCardsData();
//       }
//     });
//   }

//   ngOnInit(): void {
//     this.initializeForm();
//   }

//   getCartData(){
//     this.isLoading = true; 
//     this.cartService.getCart().subscribe(
//       res => {
//         this.deals = res.data;
//         if(this.deals.length > 0){
//           this.balRewardAmt = this.deals[0].balRewardAmt;
//           this.calculateAmounts();

//           this.setCartCount(this.deals.length);
//         } 
//         else{
//           this.router.navigate([`${environment.dealsBaseUrl}`]);
//         }
//         // console.log(this.deals);
//         this.isLoading = false; 
//     },
//       errorMessage => { this.isLoading = false;  }
//     )
//   }

//   getUserCardsData(){
//     this.isLoading = true; 
//     this.cartService.getCards().subscribe(
//       res => {
//         this.setCardData(res.data);
//         // console.log(this.cards);
//         this.isLoading = false; 
//     },
//       errorMessage => { this.isLoading = false;  }
//     )
//   }

//   setCardData(data){
//     this.cards = data;
//     if(this.cards.length > 0){
//       this.selectedCard = this.cards[0];
//     }
//   }

//   onShowCreditCardModal(){    
//     this.cardForm.setValue({
//       fullName: '', cardNo: '',
//       expiryDate: '', cvvNo: '',
//       address: '', city: '',
//       state: '', pinCode: '', 
//       country: 'us', cardType: ''
//     }); 
//     this.creditCardModalDisplay = 'block';
//   }

//   get f() { return this.cardForm.controls; }  

//   onSubmit(){
//     this.submitted = true;
//     if (!this.cardForm.valid) {
//       return;
//     }

//     console.log("cardForm.value : ",  this.cardForm.value);
//     if(confirm("Are you sure to save new credit card?")) {
//       this.isLoading = true; 
//       this.cartService.addCard(this.cardForm.value).subscribe(
//         res => {
//           //console.log(resData);
//           this.setCardData(res.data);
//           this.submitted = false;   
//           this.creditCardModalDisplay = 'none';
//           this.initializeForm();   
//           this.cardForm.reset();
//           this.isLoading = false; 
//           this.toastrService.success("Credit card saved successfully");
//         },
//         errorMessage => {
//           this.isLoading = false; 
//           this.toastrService.error(errorMessage);
//         }        
//       );
//     }
//   }

//   onCreateCheckouSession(){   
//     if(this.selectedCard == null){
//       this.toastrService.info("Card is required.");
//       return;
//     }else
//     {
//       if(this.deals?.length > 0 && this.selectedCard){ 
//         this.calculateAmounts();
//         if(confirm("Are you sure to place order?")) {
//           this.isLoading = true;
//           
//           const userId = this.user.id;
//           const cartDelas = this.deals;
//           const cartAmounts = {
//             subTotalAmount : this.subTotal, 
//             subDiscAmount : this.subDiscAmount,
//             rewardAmount: this.rewardAmt,  
//             couponAmount: this.discAmt,
//             totalAmount: this.totalAmt
//           };
//           const cartCoupon = this.cartPromo; 
//           const dealList = [];
//           this.deals.forEach(deal => {
//             dealList.push(deal.dealId);
//           });
//           const orderRequest = { userId, cartDelas, cartAmounts, cartCoupon, dealList };
//           // console.log("orderRequest : ", orderRequest);
//           this.cartService.createCheckoutSession(orderRequest)
//           .subscribe(
//             resData => {
//               // console.log(resData);
//               this.loadStripCheckout(resData.data.sessionId);
//               this.isLoading = false;
//                      
//             },
//             errorMessage => {
//               this.isLoading = false;
//               
//               this.toastrService.error(errorMessage);
//             }        
//           );
//         }
//       }
//     }
//   }

//   async loadStripCheckout(sessionId:string){
//     this.stripe = await loadStripe(environment.stripeClientKey);
//     this.stripe.redirectToCheckout({ sessionId:sessionId }); 
//   }

//   getLastFourDigit(cardNo){
//     if( cardNo.length > 3 ) {
//       return cardNo.substr(cardNo.length - 4);
//     }
//     return cardNo;
//   }

//   calculateAmounts(){
//     this.subTotal = 0; this.discAmt = 0; this.totalAmt = 0, 
//     this.subDiscAmount =0; this.rewardAmt = 0; 
    
//     const calItemTotal = this.deals.reduce(function(sum, current) {
//       const calAmount = (+current.discPrice * + current.quantity);
//       return sum + calAmount;
//     }, 0);

//     const calItemDiscTotal = this.deals.reduce(function(sum, current) {
//       const calAmount = (+current.discAmount * + current.quantity);
//       return sum + calAmount;
//     }, 0);

//     this.subDiscAmount = calItemDiscTotal;
    
//     this.discAmt = this.cartPromo?.amount == undefined ? 0 : this.cartPromo?.amount;

//     this.subTotal = calItemTotal; 
//     this.rewardAmt =this.balRewardAmt;
//     if(this.balRewardAmt > 0 && this.balRewardAmt >= this.subTotal){
//       this.rewardAmt = this.subTotal - 1;
//     }   

//     this.totalAmt = (( +this.subTotal - +this.rewardAmt ) - +this.discAmt );
//   }

//   setCartCount(ccnt:Number) {
//     const updatedUser = { ...this.user, ccnt: ccnt };
//     this.authService.updateCartCount(ccnt, updatedUser);
//   }

//   validate() {
//     this.validationRes = cardValidator.number(this.f.cardNo.value);
//     if (this.validationRes.card) {
//       this.maxLength = this.validationRes.card?.lengths?.pop() + this.validationRes.card?.gaps.length;
//       this.maxCvvLength = this.validationRes.card?.code.size;
//       let maskArray = new Array(this.maxLength).fill('0');
//       this.validationRes.card?.gaps.reverse().forEach(gap=> {maskArray.splice(gap, 0, ' ');})
//       this.imask = {mask:maskArray.join('')}
//       this.f.cardType.setValue(this.validationRes.card.type);
//    } else {
//       this.maxLength = 255;
//     }
//   }

//   getIssuerIcon(cardType:string) {
//     return `https://cdn.flnf.hu/assets/${cardType}.svg`
//   }

//   private initializeForm() {
//     this.cardForm = this.formBuilder.group({
//       fullName: ['', [Validators.required]],
//       cardNo: ['', [Validators.required]],
//       expiryDate: ['', [Validators.required, Validators.pattern(Patterns.expiryDate)]],
//       cvvNo: ['', [Validators.required, Validators.minLength(3)]],
//       address: [],
//       city: [],
//       state: [],
//       pinCode: [],
//       country: ['us', [Validators.required]],
//       cardType: []
//     });
//   }
  
//   ngOnDestroy(): void {
//     if(this.userSub){
//       this.userSub.unsubscribe();
//     }
//   }
// }
