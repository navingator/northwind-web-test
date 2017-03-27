import { Component }                          from '@angular/core';
import { FormBuilder, FormGroup, Validators,
  AbstractControl, FormControl }              from '@angular/forms';

import { Product }  from '../product.class';

@Component({
  moduleId: module.id,
  templateUrl: './product-new.component.html',
})
export class ProdNewComponent {
  productForm: FormGroup;
  product = new Product();

  submitted = false;
  submitError = false;

  constructor(
    private fb: FormBuilder
  ) {
    this.createCatNewForm();
  }

  createCatNewForm() {
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
    this.product.category = this.productForm.get('category').value;
    //TODO send it to a service to be processed
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
