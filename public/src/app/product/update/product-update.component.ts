import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { Location }               from '@angular/common';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

import { ProductService }       from '../product.service';
import { ProdCatSearchService } from '../../product_category/prodcat-search.service';

import { Product } from '../product.class';
import { ProdCat } from '../../product_category/prodcat.class';

@Component({
  moduleId: module.id,
  templateUrl: './product-update.component.html',
  styleUrls: [ '../searchbox.css' ],
})
export class ProdUpdateComponent implements OnInit {
  selectedProduct = new Product();
  prodCatSelected = 0;
  prodCats: Observable<ProdCat[]>;
  hidden = true;
  private searchTerms = new Subject<string>();

  constructor(
    private productService: ProductService,
    private prodCatSearchService: ProdCatSearchService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.productService.getProduct(+params.id))
      .subscribe(selectedProduct => this.selectedProduct = selectedProduct);

    this.prodCats = this.searchTerms
      .debounceTime(200)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(searchTerm => {   // switch to new observable each time the term changes
        if (searchTerm) {
          return this.prodCatSearchService.search(searchTerm);
        } else {
          return Observable.of<ProdCat[]>([]);
        }
      })
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<ProdCat[]>([]);
      });
  }

  prodCatSearch(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
    this.hidden = false;
  }

  setValue(prodCat: ProdCat) {
    this.selectedProduct.categoryName = prodCat.name;
    this.selectedProduct.categoryId = prodCat.id;
    this.hidden = true
    this.prodCatSearch('');
  }

  save(): void {
    this.productService.updateProduct(this.selectedProduct)
      .subscribe(() => this.location.back())
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
