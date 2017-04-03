import { Component, OnInit }                          from '@angular/core';
import { FormBuilder, FormGroup, Validators,
  AbstractControl, FormControl }              from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { Router }         from '@angular/router';

import { ProductService } from '../product.service';

import { Product }  from '../product.class';

@Component({
  moduleId: module.id,
  templateUrl: './product-new.component.html',
})
export class ProdNewComponent implements OnInit {
  productForm: FormGroup;
  product = new Product();

  submitted = false;
  submitError = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createNewProductForm();
  }

  createNewProductForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required]
    })
  }

  onSubmit() {
    //* if the form is invalid, mark all invalid feilds
    if (this.productForm.invalid) {
      this.markAllDirty(this.productForm);
      this.submitError = true;
      return;
    }
    this.submitted = true;
    this.submitError = false;
    //* else populate the product
    this.product.name = this.productForm.get('name').value;
    this.product.categoryName = this.productForm.get('category').value;
    // send it to a service to be processed
    this.productService.createProduct(this.product)
      .subscribe(
        () => this.router.navigate(['/product'])
      )
  }

  private markAllDirty(control: AbstractControl) {
    if(control.hasOwnProperty('controls')) {
      control.markAsDirty(true) // mark group
      let ctrl = <any>control;
      for (let inner in ctrl.controls) {
        this.markAllDirty(ctrl.controls[inner] as AbstractControl);
      }
    }
    else {
      (<FormControl>(control)).markAsDirty(true);
    }
  }

}
