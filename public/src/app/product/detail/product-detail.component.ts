import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Product } from '../product.class';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public product: Product;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.productService.getProduct(+params.productId))
      .subscribe(product => this.product = product);
  }
}
