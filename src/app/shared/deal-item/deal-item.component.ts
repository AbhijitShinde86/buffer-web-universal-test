import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deal-item',
  templateUrl: './deal-item.component.html',
  styles: [
  ]
})
export class DealItemComponent implements OnInit {
  @Input() deal: any;
  @Input() isEditable: boolean = false;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.deal.imagePaths.sort(this.compareOrder);
  }

  compareOrder(a, b) {
    return a.orderBy - b.orderBy;
  }

  getDealTypeName(dealType:Number){
    return dealType == 1 ? 'Lifetime Deal' :  dealType == 2 ?'Annual' : 'Freebie';
  }

  getDealTypeClass(dealType:Number){
    return dealType == 3 ? 'bg-success' : 'bg-primary';
  }
  onDealClick(){
    this.router.navigate([`${environment.dealsBaseUrl}/${this.deal.dealLink}`])
  }
}
