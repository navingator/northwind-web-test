import { Component, OnInit, ViewChild }  from '@angular/core';
import { MdSidenav }                     from '@angular/material';
import { Router }                        from '@angular/router';

import { Observable }    from 'rxjs/Observable';

import { ProdCatService }  from '../prodcat.service';

import { ProdCat } from '../prodcat.class';

import 'hammerjs';

@Component({
  moduleId: module.id,
  templateUrl: './category-list.component.html',
})
export class CatListComponent {
  public prodCats: ProdCat[];
  public emptyProdCat: ProdCat;

  @ViewChild('sidenav') public sidenav: MdSidenav;
  public selectedProdCat: ProdCat;

  constructor(
    private prodCatService: ProdCatService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.prodCatService.listCategories()
      .subscribe(
        prodCats => this.prodCats = prodCats,
        (error: Error) => console.error('Error: ' + error),
      );
  }

  public showProdCat(prodCat: ProdCat): void {
    this.selectedProdCat = prodCat;
    this.sidenav.open();
  }

  public deleteProdCat(selectedProdCat: ProdCat): void {
    if (!selectedProdCat) { return; }
    this.prodCatService.deleteCategory(selectedProdCat.id)
      .subscribe(
        () => this.prodCats = this.prodCats.filter(arrayCat => arrayCat !== selectedProdCat),
        (error: Error) => console.error('Error: ' + error),
      );
  }

  public onSelect(prodCat: ProdCat): void {
    if (this.selectedProdCat) {
      this.sidenav.close();
      setTimeout(() => this.sidenav.open(), 500);
      this.selectedProdCat = prodCat;
    }
  }

  public onDeselect(): void {
    this.selectedProdCat = this.emptyProdCat;
    this.sidenav.close();
  }

}
