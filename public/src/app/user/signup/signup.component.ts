import { Component, OnChanges }               from '@angular/core';
import { FormBuilder, FormGroup, Validators,
  AbstractControl, FormControl }              from '@angular/forms';

import { Router }                             from '@angular/router';

import { UserAuthService } from '../user-auth.service';

import { User } from '../user.class'

@Component({
  moduleId: module.id,
  templateUrl: './signup.component.html',
})
export class SignupComponent {

  signupForm: FormGroup;
  user = new User();

  submitted = false;
  submitErrorMessage = '';

  private isUsernameUnique = true;

  constructor(
      private fb: FormBuilder,
      private userAuthService: UserAuthService,
      private router: Router
    ) {
    this.createSignupForm();
  }

  createSignupForm() {
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
    })
  }

  /** Called by form submission **/
  onSubmit() {
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

    // Send it to the userAuthService
    return this.userAuthService.createUser(this.user)
      .subscribe(
        () => this.router.navigate(['/signup-congrats']),
        err => {
          this.submitted = false;
          this.submitErrorMessage = err.message;
          if (err.code === 1010) {
            this.isUsernameUnique = false;
            this.signupForm.get('username').updateValueAndValidity();
          }
        });
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

  /**
   * Returns a validator that compares the value to a sibling FormControl
   *  Parameters:
   *    ctrlKey: Key that will be used to retrieve the FormControl to compare to
   *    error: Error Key to add when invalid
   *  Returns: Validator function
   **/
  private equalsValidatorFactory(ctrlKey: string, error: string) {
    return (fc: FormControl): {[key: string]: any} => {
      // If the parent doesn't exist yet, return null (no errors)
      if (!fc.parent) {
        return null;
      }

      let val = fc.value;
      let compVal = fc.parent.controls[ctrlKey].value;

      if (val === compVal) {
        return null;
      } else {
        return { [error] : true };
      }
    }
  }

  private usernameUniqueValidator = (fc: FormControl) => {
    if(this.isUsernameUnique) {
      this.submitErrorMessage = ''; // reset the submit error message
      return null;
    } else {
      this.isUsernameUnique = true; // reset it after the field has been touched
      return { 'usernameTaken' : true };
    }
  }

  /** Called by keyup on password - validates that password still matches **/
  revalidateConfirm() {
    this.signupForm.get('passwordConfirm').updateValueAndValidity();
  }
}
