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
import { CategorySearchService } from '../../category/category-search.service';
import { ProductService }       from '../product.service';

import { Category } from '../../category/category.class';
import { Product } from '../product.class';

@Component({
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit {
  public productForm: FormGroup;
  public selectedProduct = new Product();

  public submitted = false;
  public submitError = '';

  public title = '';
  public submitBtnTitle = '';
  public formErrors = {
    name: '',
    category: ''
  };
  public validationMessages = {
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

  public categories: Observable<Category[]>;
  private lastCategory: Category;
  private searchTerms = new Subject<string>();

  // Constructor

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private changeService: ProductChangeService,
    private categorySearchService: CategorySearchService,
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
          this.categorySearch(selectedProduct.categoryName);
        } else {
          this.title = 'New Product';
          this.submitBtnTitle = 'Create';
        }
      });

    this.categories = this.searchTerms
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(searchTerm => {
        if (searchTerm) {
          return this.categorySearchService.search(searchTerm);
        } else {
          return Observable.of<Category[]>([]);
        }
      })
      .catch(error => {
        return Observable.of<Category[]>([]);
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
        Validators.minLength(3),
        Validators.maxLength(40)
      ]],
      category: [this.selectedProduct.categoryName, Validators.required, this.categoryValidator]
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
        if (control && !control.valid) {
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

  // Tools for categorySearch

  public categorySearch(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
  }

  public setValue(category: Category): void {
    this.productForm.controls.category.setValue(category.name);
    this.selectedProduct.categoryId = category.id;
    this.categorySearch(category.name);
  }

  // Saving the product result

  public onSubmit(): void {
    this.submitted = true;

    this.selectedProduct.name = this.productForm.get('name').value;
    this.selectedProduct.categoryName = this.productForm.get('category').value;
    this.selectedProduct.discontinued = false; // if it is newly created, it will not be discontinued.
    if (!this.selectedProduct.categoryId) { this.selectedProduct.categoryId = this.lastCategory.id; };
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
  }

  /**
   * Helper function to handle failed submissions
   * @param {any} err Error returned from CategoryService
   */
  private onSubmitError(err: any): void {
    this.submitError = err.message;
    this.submitted = false;
  }

  private categoryValidator = (fc: FormControl): Observable<{[key: string]: any}> => {
    const err = {invalidCategory: true};
    return this.categories
      .switchMap(categories => {
        this.lastCategory = categories[0];  // TODO run through all search terms
        for (const category of categories) {
          if (category.name === fc.value) {
            return Observable.of(null);
          }
        }
        return Observable.of(err);
      })
      .first();
    }
  }
