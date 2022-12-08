import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styles: [
  ]
})
export class WelcomeComponent implements OnInit {
  count = 1800;
  intervalId
  constructor( private meta:Meta, private title:Title ) { 
    this.meta.addTags([
      {name:'description', content:'BufferApps - Platform For Everyday Entrepreneurs! Discover, Test and Buy Your Favorite SaaS'},
      {name:'keywords', content:'BufferApps, Beta launch platform for saas, Saas beta platform, Saas marketplace, Ltd saas platform'}
    ]);
    this.title.setTitle('BufferApps - A SaaS Launchpad');
    this.intervalId = setInterval(() => {
      if(this.count == 2364) 
        clearInterval(this.intervalId)
      this.count = this.count + 1;
    });
   }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
