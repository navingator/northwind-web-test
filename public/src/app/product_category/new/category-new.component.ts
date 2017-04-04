import { Component, OnInit }   from '@angular/core';
import { AbstractControl, FormBuilder, FormControl,
  FormGroup, Validators}       from '@angular/forms';
import { Router }              from '@angular/router';

import { Observable }          from 'rxjs/Observable';

import { ProdCatService }  from '../prodcat.service';

import { ProdCat }  from '../prodcat.class';

@Component({
  moduleId: module.id,
  templateUrl: './category-new.component.html',
})
export class CatNewComponent implements OnInit  {
  public categoryForm: FormGroup;
  public prodCat = new ProdCat();

  public submitted = false;
  public submitError = '';

  constructor(
    private fb: FormBuilder,
    private prodCatService: ProdCatService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.createCatNewForm();
  }

  public createCatNewForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    // else populate the product category
    this.prodCat.name = this.categoryForm.get('name').value;
    this.prodCat.description = this.categoryForm.get('description').value;

    this.prodCatService.createCategory(this.prodCat)
      .subscribe(
        () => this.router.navigate(['/category']),
        err => {
          this.submitError = err.message;
          this.submitted = false;
        }
      );
  }

}
