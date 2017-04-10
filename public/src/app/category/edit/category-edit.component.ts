import { Component, OnInit }              from '@angular/core';
import { AbstractControl, FormBuilder, FormControl,
  FormGroup, Validators}                  from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { CategoryChangeService } from '../category-change.service';
import { CategoryService } from '../category.service';

import { Category } from '../category.class';

@Component({
  templateUrl: './category-edit.component.html',
})
export class CategoryEditComponent implements OnInit  {
  public categoryForm: FormGroup;
  public category = new Category();

  public submitted = false;
  public submitError = '';

  public title = '';
  public submitBtnTitle = '';

  constructor(
    private fb: FormBuilder,
    private changeService: CategoryChangeService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Initializes the component by creating the category reactive form and
   * getting the category from the route parameters
   */
  public ngOnInit(): void {
    this.createCatForm();

    this.route.params
      .switchMap((params: Params) => {
        if (params.categoryId) {
          return this.categoryService.getCategory(+params.categoryId);
        }
        return Observable.of<Category>(null);
      })
      .subscribe(category => {
        if (category) {
          this.title = 'Edit Category';
          this.submitBtnTitle = 'Save';
          this.category = category;
          this.categoryForm.reset({
            name: category.name,
            description: category.description
          });
        } else {
          this.title = 'New Category';
          this.submitBtnTitle = 'Create';
        }
      });
  }

  /**
   * Initializes the reactive category form
   */
  public createCatForm(): void {
    this.categoryForm = this.fb.group({
      name: [this.category.name, Validators.required],
      description: [this.category.description, Validators.required]
    });
  }

  /**
   * Handles submission of category creation and edits
   */
  public onSubmit(): void {
    this.submitted = true;
    // else populate the category
    this.category.name = this.categoryForm.get('name').value;
    this.category.description = this.categoryForm.get('description').value;

    if (this.category.id) {
      this.categoryService.updateCategory(this.category)
        .subscribe(
          () => this.onSubmitSuccess(),
          err => this.onSubmitError(err)
        );
    } else {
      this.categoryService.createCategory(this.category)
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
    this.changeService.notifyCategoryChange();
  }

  /**
   * Helper function to handle failed submissions
   * @param {any} err Error returned from CategoryService
   */
  private onSubmitError(err: any): void {
    this.submitError = err.message;
    this.submitted = false;
  }

}
