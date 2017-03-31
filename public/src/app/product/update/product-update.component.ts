import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Product }        from '../product.class';
import { ProductService } from '../product.service';

@Component({
  moduleId: module.id,
  templateUrl: './product-update.component.html',
})
export class ProdUpdateComponent implements OnInit {
  selectedProduct: Product;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.productService.getProduct(+params.id))
      .subscribe(selectedProduct => this.selectedProduct = selectedProduct);
  }

  save(): void {
    this.productService.updateProduct(this.selectedProduct)
  }

  log(): void {
    console.log(this.selectedProduct)
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
