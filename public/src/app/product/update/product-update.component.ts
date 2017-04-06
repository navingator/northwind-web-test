import { Component, Input, OnInit }       from '@angular/core';
import { AbstractControl, FormBuilder, FormControl,
  FormGroup, ValidatorFn, Validators }    from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable }  from 'rxjs/Observable';
import { Subject }     from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';

import { ProductChangeService } from '../product-change.service';
import { ProdCatSearchService } from '../../product_category/prodcat-search.service';
import { ProductService }       from '../product.service';

import { ProdCat } from '../../product_category/prodcat.class';
import { Product } from '../product.class';

@Component({
  templateUrl: './product-update.component.html',
  styleUrls: [ '../searchbox.css' ],
})
export class ProdUpdateComponent implements OnInit {
  public productForm: FormGroup;
  public selectedProduct = new Product();

  public submitted = false;
  public selected = false;
  public submitError = '';

  public title = '';
  public submitBtnTitle = '';

  public prodCats: Observable<ProdCat[]>;
  private lastProdCat: ProdCat;
  private searchTerms = new Subject<string>();

  private formErrors = {
    name: '',
    category: ''
  };
  private validationMessages = {
    name: {
      required:      'Name is required.',
      minlength:     'Must be at least 3 characters.',
      maxlength:     'Must be less than 40 characters.'
    },
    category: {
      required:      'Category is required.',
      uniqueName:    'Category must already exist.'
    }
  };

  // Constructor

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private changeService: ProductChangeService,
    private prodCatSearchService: ProdCatSearchService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // ngOnInit

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => {
        if (+params.productId) {
          return this.productService.getProduct(+params.productId);
        }
        return Observable.of<Product>(null);
      })
      .subscribe(selectedProduct => {
        if (selectedProduct) {
          this.title = 'Edit Product';
          this.submitBtnTitle = 'Save';
          this.selectedProduct = selectedProduct;
          this.productForm.reset({
            name: selectedProduct.name,
            category: selectedProduct.categoryName
          });
        } else {
          this.title = 'New Product';
          this.submitBtnTitle = 'Create';
        }
      });

    this.prodCats = this.searchTerms
      .debounceTime(150)
      .distinctUntilChanged()
      .switchMap(searchTerm => {
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

    this.onValueChanged(); // (re)set validation messages
  }

  // Creating the new form

  public createUpdateProductForm(): void {
    this.productForm = this.fb.group({
      name: [this.selectedProduct.name, [
        Validators.required,
        Validators.minLength(3), // TODO figure out a way to delay min length until after they start
        Validators.maxLength(40)
        ]
      ],
      category: [this.selectedProduct.categoryName, Validators.required, this.prodCatValidator]
    });
  }

  // Validation for error checking

   public onValueChanged(data?: any): void {
    if (!this.productForm) { return; }
    this.selected = false;
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
    this.productForm.controls.category.setValue(prodCat.name, {emitEvent: true});
    this.selectedProduct.categoryId = prodCat.id;
    this.selected = true;
  }

  // Saving the product result

  public onSubmit(): void {
    this.submitted = true;

    this.selectedProduct.name = this.productForm.get('name').value;
    this.selectedProduct.categoryName = this.productForm.get('category').value;
    this.selectedProduct.discontinued = false;
    if (!this.selectedProduct.categoryId) { this.selectedProduct.categoryId = this.lastProdCat.id; };
    if (this.selectedProduct.id) {
      this.productService.updateProduct(this.selectedProduct)
        .subscribe(
          () => this.onSubmitSuccess(),
          err => this.onSubmitError(err)
        );
    } else {
      this.productService.createProduct(this.selectedProduct)
        .subscribe(
          () => this.onSubmitSuccess(),
          err => this.onSubmitError(err)
        );
    }
  }

  /**
   * Helper function to handle successful submissions
   */
  private onSubmitSuccess(): void {
    this.changeService.notifyProductChange();
    // this.router.navigate([]);
  }

  /**
   * Helper function to handle failed submissions
   * @param {any} err Error returned from CategoryService
   */
  private onSubmitError(err: any): void {
    this.submitError = err.message;
    this.submitted = false;
  }

  private prodCatValidator = (fc: FormControl): Observable<{[key: string]: any}> => {
    const err = {invalidCategory: true};
    return this.prodCats
      .switchMap(prodCats => {
        this.lastProdCat = prodCats[0];
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
