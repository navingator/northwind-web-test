/* Angular */
import { Component, OnInit, ViewChild }   from '@angular/core';
import { AbstractControl, FormBuilder, FormControl,
  FormGroup, Validators}                  from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

/* RxJS */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

/* Components */
import { NoticeComponent } from '../../shared/notice/notice.component';

/* Services */
import { CategoryChangeService } from '../category-change.service';
import { CategoryService } from '../category.service';
import { ErrorService } from '../../core/error.service';
import { FormHelperService } from '../../core/form-helper.service';

/* Classes */
import { Category } from '../category.class';

@Component({
  templateUrl: './category-edit.component.html',
})
export class CategoryEditComponent implements OnInit  {
  public categoryForm: FormGroup;
  public category = new Category();

  public submitted = false;
  public submitError = '';
  public formHidden = true;

  public title = '';
  public submitBtnTitle = '';

  public formErrors = {
    name: '',
    description: ''
  };
  public validationMessages = {
    name: {
      required:      'Name is required.',
      minlength:     'Must be at least 3 characters.',
      maxlength:     'Must be less than 15 characters.'
    },
    description: {
      required:      'Description is required.',
      maxlength:     'Description must be less than 100 characters.'
    }
  };

  @ViewChild(NoticeComponent) private notice: NoticeComponent;

  constructor(
    private changeService: CategoryChangeService,
    private categoryService: CategoryService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private formHelperService: FormHelperService,
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
      .subscribe(
        category => {
          this.formHidden = false;
          this.setCategory(category);
        },
        error => {
          this.errorService.handleError(error, this.notice);
          this.formHidden = true;
        }
      );

    // subscribe to form value changes to update error object
    this.categoryForm.valueChanges
      .subscribe((data: any) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages
  }

  /**
   * Initializes the reactive category form
   */
  public createCatForm(): void {
    this.categoryForm = this.fb.group({
      name: [this.category.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]],
      description: [this.category.description, [
        Validators.required,
        Validators.maxLength(100)
      ]]
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
   * Sets the category for the component, along with logic for handling whether
   * this should edit a category or create a new one
   * @param {Category} category Category to edit
   */
  private setCategory(category: Category): void {
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

  private onValueChanged(data?: any): void {
    this.formHelperService.updateFormErrors(this.categoryForm,
      this.formErrors,
      this.validationMessages);
  }

}
