import { Location }                     from '@angular/common';
import { Component, OnInit }            from '@angular/core';
import { AbstractControl, FormBuilder,
  FormControl, FormGroup, Validators }  from '@angular/forms';
import { ActivatedRoute, Params }       from '@angular/router';
import { Observable }                   from 'rxjs/Observable';
import { Subject }                      from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';

import { ProdCatSearchService } from '../../product_category/prodcat-search.service';
import { ProductService }       from '../product.service';

import { ProdCat } from '../../product_category/prodcat.class';
import { Product } from '../product.class';

@Component({
  moduleId: module.id,
  templateUrl: './product-update.component.html',
  styleUrls: [ '../searchbox.css' ],
})
export class ProdUpdateComponent implements OnInit {
  public productForm: FormGroup;
  public submitted = false;
  public selectedProduct = new Product();
  public prodCats: Observable<ProdCat[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private prodCatSearchService: ProdCatSearchService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.productService.getProduct(+params.id))
      .subscribe(selectedProduct => this.selectedProduct = selectedProduct);

    this.prodCats = this.searchTerms
      .debounceTime(100)        // wait 300ms after each keystroke before considering the term
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
        return Observable.of<ProdCat[]>([]);
      });
    this.createUpdateProductForm();
  }

  public prodCatSearch(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
  }

  public createUpdateProductForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required, this.prodCatValidator]
    });
  }

  public setValue(prodCat: ProdCat): void {
    this.selectedProduct.categoryName = prodCat.name;
    this.selectedProduct.categoryId = prodCat.id;
    this.prodCatSearch('');
  }

  public save(): void {
    this.submitted = true;
    this.selectedProduct.name = this.productForm.get('name').value;
    this.selectedProduct.categoryName = this.productForm.get('category').value;
    this.productService.updateProduct(this.selectedProduct)
      .subscribe(() => this.location.back());
  }

  private prodCatValidator = (fc: FormControl): Observable<{[key: string]: any}> => {
    const err = {'Invalid Category': true};
    return this.prodCats
      .switchMap(prodCats => {
        for (const prodCat of prodCats) {
          if (prodCat.name === fc.value) {
            return Observable.of(null);
          }
        }
        return Observable.of(err);
      })
      .first();
  }
}
