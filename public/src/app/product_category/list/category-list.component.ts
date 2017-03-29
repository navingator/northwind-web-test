import { Component, ViewChild, OnInit }  from '@angular/core';
import { MdSidenav }     from '@angular/material';
import { Observable }          from 'rxjs/Observable';

import { ProdCatService }  from '../prodcat.service';

import { ProdCat } from '../prodcat.class';

import 'hammerjs';

@Component({
  moduleId: module.id,
  templateUrl: './category-list.component.html',
})
export class CatListComponent{
  prodCats: ProdCat[];

  constructor(
    private prodCatService: ProdCatService
  ) {}

  ngOnInit() {
    this.prodCatService.listCategories()
      .subscribe(
        prodCats => this.prodCats = prodCats,
        (error: Error) => console.error('Error: ' + error),
      );
  }

  @ViewChild('sidenav') sidenav: MdSidenav;
  currentProdCat: ProdCat;


  showProdCat(prodCat: ProdCat) {
    this.currentProdCat = prodCat;
    this.sidenav.open();
  }

  deleteProdCat(currentProdCat: ProdCat) {
    if (!currentProdCat) { return; }
    this.prodCatService.deleteCategory(currentProdCat.id)
      .subscribe(
        () => this.prodCats = this.prodCats.filter(arrayCat => arrayCat !== currentProdCat),
        (error: Error) => console.error('Error: ' + error),
      )
  }

}
