import { Component, OnInit }     from '@angular/core';
import { FormBuilder, FormGroup, Validators,
  AbstractControl, FormControl }   from '@angular/forms';
import { Observable }          from 'rxjs/Observable';
import { Router }              from '@angular/router';

import { ProdCatService }  from '../prodcat.service';

import { ProdCat }  from '../prodcat.class';

@Component({
  moduleId: module.id,
  templateUrl: './category-new.component.html',
})
export class CatNewComponent implements OnInit  {
  categoryForm: FormGroup;
  prodCat = new ProdCat();

  submitted = false;
  submitError = false;

  constructor(
    private fb: FormBuilder,
    private prodCatService: ProdCatService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createCatNewForm();
  }

  createCatNewForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  onSubmit() {
    //* if the form is invalid, mark all invalid feilds
    if (this.categoryForm.invalid) {
      this.markAllDirty(this.categoryForm);
      this.submitError = true;
      return;
    }
    this.submitted = true;
    this.submitError = false;
    //* else populate the product category
    this.prodCat.name = this.categoryForm.get('name').value;
    this.prodCat.description = this.categoryForm.get('description').value;
    //TODO send it to a service to be processed
    this.prodCatService.createCategory(this.prodCat)
      .subscribe(
        () => this.router.navigate(['/category'])
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
