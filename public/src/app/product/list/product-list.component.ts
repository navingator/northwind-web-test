import { Component, ViewChild }  from '@angular/core';
import { MdSidenav }     from '@angular/material';

import 'hammerjs';

@Component({
  moduleId: module.id,
  templateUrl: './product-list.component.html',
})
export class ProdListComponent {
  products = [
    {color: 'lightblue', name: "iPhone", category: "Phone", description: "A phone from Apple."},
    {color: 'lightgreen', name: "Android S6", category: "Phone", description: "A phone from Microsoft."},
    {color: 'lightpink', name: "Pixl", category: "Phone", description: "A phone from Google."},
    {color: '#DDBDF1', name: "Grahmophone", category: "Phone", description: "A phone from Alexander Grahm Bell. asdfasdfasdfasdfas asdf asdf as df asd f asd fas dfas df as df a sd fa sdf as d fa sdf a sdf asd "},
  ];

  @ViewChild('sidenav') sidenav: MdSidenav;
  currentProduct = {};

  showProduct(product: {}) {
    console.log(product);
    this.currentProduct = product
    this.sidenav.open()
  }
}
