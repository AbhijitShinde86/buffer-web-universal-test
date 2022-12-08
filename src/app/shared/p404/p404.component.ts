import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-p404',
  templateUrl: './p404.component.html'
})
export class P404Component implements OnInit {

  constructor(private router: Router) {
    // router.events.subscribe((event) => {
    //   console.log(event);
    // });
  }

  ngOnInit(): void {
  }

}
