import { Component, ViewChild, OnInit }  from '@angular/core';
import { MdSidenav }     from '@angular/material';
import { Observable }    from 'rxjs/Observable';
import { Router, ActivatedRoute, Params }  from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { ProductService }  from '../product.service';

import { Product } from '../../product/product.class';

import 'hammerjs';

@Component({
  moduleId: module.id,
  templateUrl: './product-list.component.html',
})
export class ProdListComponent implements OnInit{
  categoryName: string;
  products: Product[];
  emptyProduct: Product;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params
      .switchMap((params: Params): Observable<Product[]> => {
        if (+params.id) {
          return this.productService.listProductsByCat(+params.id)
        } else {
          return this.productService.listAllProducts()
        }
      })
      .subscribe(
        (products: Product[]) => {
          this.products = products,
          this.categoryName = products[0].categoryName
        },
        (error: Error) => console.error('Error: ' + error),
      );
  }

  @ViewChild('sidenav') sidenav: MdSidenav;
  selectedProduct: Product;

  showProduct(product: Product) {
    console.log(product);
    this.selectedProduct = product
    this.sidenav.open()
  }

  deleteProduct(selectedProduct: Product) {
    if (!selectedProduct) { return; }
    this.productService.deleteProduct(selectedProduct.id)
      .subscribe(
        () => this.products = this.products.filter(arrayProd => arrayProd !== selectedProduct),
        (error: Error) => console.error('Error: ' + error),
      )
  }


  onSelect(product: Product): void {
    if (this.selectedProduct) {
      this.sidenav.close()
      setTimeout(() => this.sidenav.open(),500);
      this.selectedProduct = product;
      console.log('onSelect')
    }
  }

  onDeselect(): void {
    this.selectedProduct = this.emptyProduct
    this.sidenav.close()
  }

}
