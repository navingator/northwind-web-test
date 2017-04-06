import { AfterViewInit, Component, OnDestroy,
  OnInit, ViewChild }                     from '@angular/core';
import { MdSidenav }                      from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable }   from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import { AuthService }          from '../../user/auth.service';
import { DialogService }        from '../../core/dialog.service';
import { ProductChangeService } from '../product-change.service';
import { ProductService }       from '../product.service';

import { Product } from '../../product/product.class';

import 'hammerjs';

@Component({
  moduleId: module.id,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProdListComponent implements OnInit, AfterViewInit, OnDestroy {
  public categoryName: string;
  public products: Product[];

  @ViewChild('sidenav') public sidenav: MdSidenav;
  public selectedProduct: Product;

  private changeSubscription: Subscription;
  private categoryId: number;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private changeService: ProductChangeService,
    private route: ActivatedRoute,
    private dialog: DialogService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const paramsObs = this.route.params
      .do((params: Params) => {
        this.categoryId = +params.id;
        if (isNaN(this.categoryId)) { this.categoryId = null; } // TODO make this better (route to 404)
      });
    this.getProductSub(paramsObs);

    const changeObs = this.changeService.prodChange$
      .do(() => {
        this.sidenav.close();
      });
    this.changeSubscription = this.getProductSub(changeObs);
  }

  public ngOnDestroy(): void {
    this.changeSubscription.unsubscribe();
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

  private getProductSub(obs: Observable<null>): Subscription {
    return obs
      .switchMap((): Observable<Product[]> => {
        if (this.categoryId) {
          return this.productService.listProductsByCat(this.categoryId);
        } else {
          return this.productService.listAllProducts();
        }
      })
      .subscribe(
        (products: Product[]) => {
          this.products = products;
          if (this.categoryId) {
            this.categoryName = products[0].categoryName;
          }
        },
        (error: Error) => console.error('Error: ' + error), // TODO add real error handling
      );

  }
}
