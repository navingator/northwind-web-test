import { Component, ViewChild }  from '@angular/core';
import { MdSidenav }     from '@angular/material';

import 'hammerjs';

@Component({
  moduleId: module.id,
  templateUrl: './category-list.component.html',
})
export class CatListComponent {
  productCats = [
    {color: 'lightblue', name: "Phones", description: "A phone from Apple."},
    {color: 'lightgreen', name: "Beverages", description: "Sweet and savory sauces, relishes, spreads, and seasonings"},
    {color: 'lightpink', name: "Confections", description: "Desserts, candies, and sweet breads"},
    {color: '#DDBDF1', name: "Produce", description: "Dried fruit and bean curd"},
  ];

  @ViewChild('sidenav') sidenav: MdSidenav;
  currentProductCat = {};

  showProductCat(productCat: {}) {
    console.log(productCat);
    this.currentProductCat = productCat;
    this.sidenav.open();
  }
}
