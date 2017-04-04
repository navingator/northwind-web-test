import { Location }                     from '@angular/common';
import { Component, OnInit }            from '@angular/core';
import { AbstractControl, FormBuilder,
  FormControl, FormGroup, Validators }  from '@angular/forms';

import { Observable }     from 'rxjs/Observable';

import { ProductService } from '../product.service';

import { Product }  from '../product.class';

@Component({
  moduleId: module.id,
  templateUrl: './product-new.component.html',
})
export class ProdNewComponent implements OnInit {
  public productForm: FormGroup;
  public product = new Product();
  public submitted = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private location: Location
  ) {}

  public ngOnInit(): void {
    this.createNewProductForm();
  }

  public createNewProductForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.product.name = this.productForm.get('name').value;
    this.product.categoryName = this.productForm.get('category').value;
    // send it to a service to be processed
    this.productService.createProduct(this.product)
      .subscribe(() => this.location.back());
  }

}
