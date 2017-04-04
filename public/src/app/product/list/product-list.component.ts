import { Component, OnInit, ViewChild }    from '@angular/core';
import { MdSidenav }                       from '@angular/material';
import { ActivatedRoute, Params, Router }  from '@angular/router';

import { Observable }                      from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

import { ProductService }  from '../product.service';

import { Product } from '../../product/product.class';

@Component({
  moduleId: module.id,
  templateUrl: './product-list.component.html',
})
export class ProdListComponent implements OnInit {
  public categoryName: string;
  public products: Product[];
  public emptyProduct: Product;

  @ViewChild('sidenav') public sidenav: MdSidenav;
  public selectedProduct: Product;

  private catList: boolean;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params): Observable<Product[]> => {
        if (+params.id) {
          this.catList = true;
          return this.productService.listProductsByCat(+params.id);
        } else {
          this.catList = false;
          return this.productService.listAllProducts();
        }
      })
      .subscribe(
        (products: Product[]) => {
          this.products = products;
          if (this.catList) {
            this.categoryName = products[0].categoryName;
          }
        },
        (error: Error) => console.error('Error: ' + error),
      );
  }

  public showProduct(product: Product): void {
    this.selectedProduct = product;
    this.sidenav.open();
  }

  public deleteProduct(selectedProduct: Product): void {
    if (!selectedProduct) { return; }
    this.productService.deleteProduct(selectedProduct.id)
      .subscribe(
        () => this.products = this.products.filter(arrayProd => arrayProd !== selectedProduct),
        (error: Error) => console.error('Error: ' + error),
      );
  }

  public onSelect(product: Product): void {
    if (this.selectedProduct) {
      this.sidenav.close();
      setTimeout(() => this.sidenav.open(), 500);
      this.selectedProduct = product;
    }
  }

  public onDeselect(): void {
    this.selectedProduct = this.emptyProduct;
    this.sidenav.close();
  }

}
