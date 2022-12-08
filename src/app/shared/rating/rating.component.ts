import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styles: [
  ]
})
export class RatingComponent implements OnInit {
  @Input() rating:Number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
