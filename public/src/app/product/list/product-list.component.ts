/* Angular */
import { AfterViewInit, Component, OnDestroy,
  OnInit, ViewChild }                     from '@angular/core';
import { MdSidenav }                      from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

/* RxJS */
import { Observable }   from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

/* Components */
import { NoticeComponent } from '../../shared/notice/notice.component';

/* Services */
import { AuthService }          from '../../user/auth.service';
import { CategoryService }      from '../../category/category.service';
import { DialogService }        from '../../core/dialog.service';
import { ErrorService }         from '../../core/error.service';
import { ProductChangeService } from '../product-change.service';
import { ProductService }       from '../product.service';

/* Classes */
import { Product } from '../product.class';
import { Category } from '../../category/category.class';

import 'hammerjs';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {
  public categoryName: string;
  public products: Product[];
  public isAdmin: boolean;
  public currentUser = this.authService.user.id;

  public selectedProduct: Product;

  private changeSubscription: Subscription;
  private categoryId: number;

  @ViewChild('sidenav') private sidenav: MdSidenav;
  @ViewChild(NoticeComponent) private notice: NoticeComponent;

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private errorService: ErrorService,
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

    this.isAdmin = this.authService.user.isAdmin;
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
  public openCreateProduct(): void {
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
        if (confirmed) { return this.deleteProduct(product); }
      });
  }

  /**
   * Calls productService to delete a product
   * @param {Product} product Product to be deleted
   */
  public deleteProduct(product: Product): void {
    if (!product) { return; }
    this.productService.deleteProduct(product.id)
      .subscribe(
        () => this.products = this.products.filter(arrayPrd => arrayPrd !== product),
        (error: Error) => this.errorService.handleError(error, this.notice)
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
          // Update category name
          this.categoryService.getCategory(this.categoryId)
            .subscribe(
              (category: Category) => this.categoryName = category.name,
              (error: Error) => this.errorService.handleError(error, this.notice)
            );
          // get products by category
          return this.productService.listProductsByCat(this.categoryId);
        } else {
          return this.productService.listAllProducts();
        }
      })
      .subscribe(
        (products: Product[]) => this.products = products,
        (error: Error) => this.errorService.handleError(error, this.notice)
      );

  }

  private showErrorNotice(error: Error): void {
    console.error(error);
    this.notice.setMessage(error.message);
    this.notice.show();
  }
}
