import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';

import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { WindowRefService } from 'src/app/services/windowRef.service';
import { UrlService } from 'src/app/shared/url.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls:['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  previousUrl: Observable<string> = this.urlService.previousUrl$;
  private routeSub:Subscription;

  isLoading = false; order:any; orderId:string; prevUrl;

  constructor(private route: ActivatedRoute, private authService: AuthService, 
    private userService:UserService, private router:Router, private urlService: UrlService,
    private toastrService:ToastrService, private windowRefService: WindowRefService
  ) { 
    if(!this.authService.checkIsStillLogged()){
      this.authService.logout();
      this.windowRefService.nativeWindow.location.reload();
    }
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.orderId = params['orderId'];
      if(this.orderId)
        this.getOrder();
      else
        this.router.navigate([`${environment.dealsBaseUrl}/`]);
    });
  }

  ngOnInit(): void {
    this.urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.prevUrl= previousUrl;
    });
  }

  getOrder(){
    this.isLoading = true; 
    this.userService.getOrder(this.orderId).subscribe(
      res => {
        this.order = res.data;
        this.order.createdAt = this.order.createdAt ? moment(this.order.createdAt).format('DD MMM YYYY') : null; ;
        // console.log(this.order)
        this.isLoading = false; 
      },
      errorMessage => { this.isLoading = false;  this.toastrService.error(errorMessage); }
    )
  }

  onGoToDeals(){
    if(this.prevUrl)
      this.router.navigate([`${this.prevUrl}`]);
    else
      this.router.navigate([`/user/dashboard/purchased-deals`]);
  }

  public downloadAsPDF() {
    const htmlToPrint = '';
      // '' +
      // '<style type="text/css">' +
      // '.pageFooter {' +
      // '    display: table-footer-group;' +
      // '    counter-increment: page;' +
      // '}' +
      // '.pageFooter:after {' +
      // '   content: "Page " counter(page)' +
      // '}' +
      // '</style>';
    var printContents = document.getElementById('print-section').innerHTML;
    var popupWin = this.windowRefService.nativeWindow.open(
      'Deal invoice',
      '_blank',
      'width=768,height=auto'
    );

    popupWin.document.write(
      '<html><head>' +
        '<link rel="stylesheet" href="' +
        'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"/>' +
        '<style type="text/css">' +
        // '.pageFooter {' +
        // '    display: table-footer-group;' +
        // '    counter-increment: page;' +
        // '}' +
        // '.pageFooter:after {' +
        // '   content: "Page " counter(page)' +
        // '}' +
        '</style>' +
        '</head><body onload="window.print();window.close()">' +
        printContents +
        '</body></html>'
    );
    popupWin.document.close();
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}



// print(): void {
//   let printContents, popupWin;
//   printContents = document.getElementById('print-section').innerHTML;
//   popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
//   popupWin.document.open();
//   popupWin.document.write(`
//     <html>
//       <head>
//         <title>Print tab</title>
//         <style>
//         //........Customized style.......
//         </style>
//       </head>
//   <body onload="window.print();window.close()">${printContents}</body>
//     </html>`
//   );
//   // popupWin.document.close();
// }