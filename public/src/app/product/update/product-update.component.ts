import { Location }                     from '@angular/common';
import { Component, Input, OnInit, }    from '@angular/core';
import { AbstractControl, FormBuilder, FormControl,
  FormGroup, ValidatorFn, Validators}   from '@angular/forms';
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
  templateUrl: './product-update.component.html',
  styleUrls: [ '../searchbox.css' ],
})
export class ProdUpdateComponent implements OnInit {

  // Setting up variables
  public productForm: FormGroup;
  public submitted = false;
  public selectedProduct = new Product();
  public prodCats: Observable<ProdCat[]>;
  public active = true;

  private searchTerms = new Subject<string>();
  private formErrors = {
    name: '',
    category: ''
  };
  private validationMessages = {
    name: {
      required:      'Name is required.',
      minlength:     'Name must be at least 3 characters long.',
      maxlength:     'Name cannot be more than 40 characters long.',
    },
    category: {
      uniqueName:    'Product category must already exist.'
    }
  };

  // Constructor

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private prodCatSearchService: ProdCatSearchService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  // ngOnInit

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.productService.getProduct(+params.productId))
      .subscribe(selectedProduct => this.selectedProduct = selectedProduct);

    this.prodCats = this.searchTerms
      .debounceTime(100)        // wait 100ms after each keystroke before considering the term
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

    this.productForm.valueChanges
      .subscribe((data: any) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  // Creating the new form

  public createUpdateProductForm(): void {
    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40)
        ]
      ],
      category: ['', null, this.prodCatValidator]
    });
  }

  // Validation for error checking

   public onValueChanged(data?: any): void {
    if (!this.productForm) { return; }
    const form = this.productForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (this.formErrors.hasOwnProperty(field)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  // Tools for prodCatSearch

  public prodCatSearch(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
  }

  public setValue(prodCat: ProdCat): void {
    this.selectedProduct.categoryName = prodCat.name;
    this.selectedProduct.categoryId = prodCat.id;
    this.searchTerms.next('');
  }

  // Saving the product result

  public onSubmit(): void {
    this.submitted = true;
    this.selectedProduct.name = this.productForm.get('name').value;
    this.selectedProduct.categoryName = this.productForm.get('category').value;
    this.productService.updateProduct(this.selectedProduct)
      .subscribe(() => this.location.back());
  }

  private prodCatValidator = (fc: FormControl): Observable<{[key: string]: any}> => {
    const err = {invalidCategory: true};
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
