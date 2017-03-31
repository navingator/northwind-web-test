import { Component, ViewChild, OnInit }  from '@angular/core';
import { MdSidenav }     from '@angular/material';
import { Observable }    from 'rxjs/Observable';
import { Router }        from '@angular/router';

import { ProdCatService }  from '../prodcat.service';

import { ProdCat } from '../prodcat.class';

import 'hammerjs';

@Component({
  moduleId: module.id,
  templateUrl: './category-list.component.html',
})
export class CatListComponent{
  prodCats: ProdCat[];
  emptyProdCat: ProdCat;

  constructor(
    private prodCatService: ProdCatService,
    private router: Router
  ) {}

  ngOnInit() {
    this.prodCatService.listCategories()
      .subscribe(
        prodCats => this.prodCats = prodCats,
        (error: Error) => console.error('Error: ' + error),
      );
  }

  @ViewChild('sidenav') sidenav: MdSidenav;
  selectedProdCat: ProdCat;

  showProdCat(prodCat: ProdCat) {
    console.log(prodCat);
    this.selectedProdCat = prodCat;
    this.sidenav.open();
  }

  deleteProdCat(selectedProdCat: ProdCat) {
    if (!selectedProdCat) { return; }
    this.prodCatService.deleteCategory(selectedProdCat.id)
      .subscribe(
        () => this.prodCats = this.prodCats.filter(arrayCat => arrayCat !== selectedProdCat),
        (error: Error) => console.error('Error: ' + error),
      )
  }

  onSelect(prodCat: ProdCat): void {
    if (this.selectedProdCat) {
      this.sidenav.close()
      setTimeout(() => this.sidenav.open(),500);
      this.selectedProdCat = prodCat;
      console.log('onSelect')
    }
  }

  onDeselect(): void {
    this.selectedProdCat = this.emptyProdCat
    this.sidenav.close()
  }

}
