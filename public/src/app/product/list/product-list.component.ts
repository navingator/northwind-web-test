import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MdSidenav }                                   from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable }                      from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { AuthService } from '../../user/auth.service';
import { DialogService } from '../../core/dialog.service';
import { ProductService }  from '../product.service';

import { Product } from '../../product/product.class';

import 'hammerjs';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProdListComponent implements OnInit, AfterViewInit {
  public categoryName: string;
  public products: Product[];

  @ViewChild('sidenav') public sidenav: MdSidenav;
  public selectedProduct: Product;

  private catList: boolean;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private dialog: DialogService,
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
        (error: Error) => console.error('Error: ' + error), // TODO add real error handling
      );
  }

  /**
   * Open the sidenav after it has been initialized, if there are any children
   */
  public ngAfterViewInit(): void {
    // Open the sidenav if there are any children (which are all displayed in the sidenav)
    if (this.route.children.length > 0) {
      this.sidenav.open();
    }
  }

  /**
   * Listener for sidenav closing
   */
  public onSidenavClose(): void {
    this.router.navigate([this.route.snapshot.url.join('/')]);
  }

  /**
   * Called by the product create button. Navigates to the create sidenav
   */
  public openCreateCategory(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
    this.sidenav.open();
  }

  /**
   * Request confirmation before deleting a product
   * @param {Product} product Product to be deleted
   */
  public confirmDelete(product: Product): void {
    this.dialog.confirm(`Are you sure you want to delete ${product.name}?`)
      .then(confirmed => {
        if (confirmed) { return this.deleteCategory(product); }
      });
  }

  /**
   * Calls productService to delete a product
   * @param {Product} product Product to be deleted
   */
  public deleteCategory(product: Product): void {
    if (!product) { return; }
    this.productService.deleteProduct(product.id)
      .subscribe(
        () => this.products = this.products.filter(arrayPrd => arrayPrd !== product),
        (error: Error) => console.error('Error: ' + error), // TODO do better error handling.
      );
  }

  /**
   * Called by the product edit button. Navigates to the edit sidenav
   */
  public openEditProduct(product: Product): void {
    this.router.navigate(['edit', product.id], { relativeTo: this.route });
    this.sidenav.open();
  }

  /**
   * Opens the product detail page for the given product
   * @param {Product} product Product to be shown
   */
  public openProductDetails(product: Product): void {
    this.router.navigate(['detail', product.id], { relativeTo: this.route });
    this.sidenav.open();
  }
}
