import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-startup-preview',
  templateUrl: './admin-startup-preview.component.html',
  styles: [
  ]
})
export class AdminStartupPreviewComponent implements OnInit {
  private routeSub:Subscription;
  
  startupLink='';

  constructor(private route: ActivatedRoute, private router:Router) { 
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.startupLink = params['link'];
      if(!this.startupLink)
        this.router.navigate([`${environment.betaBaseUrl}/`]);
    });  
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}