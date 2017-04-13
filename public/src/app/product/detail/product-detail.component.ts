/* Angular */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';

/* Components */
import { NoticeComponent } from '../../shared/notice/notice.component';

/* Services */
import { ErrorService }         from '../../core/error.service';
import { ProductService } from '../product.service';

/* Classes */
import { Product } from '../product.class';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public product: Product;

  @ViewChild(NoticeComponent) private notice: NoticeComponent;

  constructor(
    private errorService: ErrorService,
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.productService.getProduct(+params.productId))
      .subscribe(
        product => this.product = product,
        error => this.errorService.handleError(error, this.notice)
      );
  }
}
