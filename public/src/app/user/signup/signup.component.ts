import { Component, OnChanges }               from '@angular/core';
import { AbstractControl, FormBuilder, FormControl,
  FormGroup, Validators}                      from '@angular/forms';

import { AuthService } from '../auth.service';

import { User } from '../user.class';

@Component({
  moduleId: module.id,
  templateUrl: './signup.component.html',
})
export class SignupComponent {

  public signupForm: FormGroup;
  public user = new User();

  public submitted = false;
  public submitErrorMessage = '';

  private isUsernameUnique = true;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService
    ) {
    this.createSignupForm();
  }

  public createSignupForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.usernameUniqueValidator
      ]],
      password: ['', Validators.required],
      passwordConfirm: ['', [
        Validators.required,
        this.equalsValidatorFactory('password', 'passwordMismatch')
      ]]
    });
  }

  /**
   * Called by form submission. Calls the AuthService to create a user.
   */
  public onSubmit(): void {
    // if the form is invalid, mark all invalid fields
    if (this.signupForm.invalid) {
      this.markAllDirty(this.signupForm);
      this.submitErrorMessage = 'Please correct issues and try again.';
      return;
    }

    // Else mark form as submitted and populate the user
    this.submitted = true;
    this.submitErrorMessage = '';
    this.user.lastName = this.signupForm.get('lastName').value;
    this.user.firstName = this.signupForm.get('firstName').value;
    this.user.username = this.signupForm.get('username').value;
    this.user.password = this.signupForm.get('password').value;

    // Send it to the authService
    this.authService.createUser(this.user)
      .subscribe(
        () => this.authService.goToHome(),
        err => {
          this.submitted = false;
          this.submitErrorMessage = err.message;
          if (err.code === 1010) {
            this.isUsernameUnique = false;
            this.signupForm.get('username').updateValueAndValidity();
          }
        });
  }

  /**
   * Called by keyup on password - validates that password still matches
   */
  public revalidateConfirm(): void {
    this.signupForm.get('passwordConfirm').updateValueAndValidity();
  }

  private markAllDirty(control: AbstractControl): void {
    if (control.hasOwnProperty('controls')) {
      control.markAsDirty(true); // mark group
      const ctrl = <any>control;
      for (const inner in ctrl.controls) {
        if (ctrl.controls.hasOwnProperty(inner)) {
          this.markAllDirty(ctrl.controls[inner] as AbstractControl);
        }
      }
    } else {
      (<FormControl>(control)).markAsDirty(true);
    }
  }

  /**
   * Returns a validator that compares the value to a sibling FormControl
   * @param  {string} ctrlKey Key that will be used to retrieve the FormControl to compare to
   * @param  {string} error   Error Key to add when invalid
   * @return {Function}       Validator function
   */
  private equalsValidatorFactory(ctrlKey: string, error: string): (fc: FormControl) => {[key: string]: any} {
    return (fc: FormControl): {[key: string]: any} => {
      // If the parent doesn't exist yet, return null (no errors)
      if (!fc.parent) {
        return null;
      }

      const val = fc.value;
      const compVal = fc.parent.controls[ctrlKey].value;

      if (val === compVal) {
        return null;
      } else {
        return { [error] : true };
      }
    };
  }

  private usernameUniqueValidator = (fc: FormControl) => {
    if (this.isUsernameUnique) {
      this.submitErrorMessage = ''; // reset the submit error message
      return null;
    } else {
      this.isUsernameUnique = true; // reset it after the field has been touched
      return { usernameTaken : true };
    }
  }
}
