import { Component, OnChanges }               from '@angular/core';
import { FormBuilder, FormGroup, Validators,
  AbstractControl, FormControl }              from '@angular/forms';

import { Router }                             from '@angular/router';

import { AuthService } from '../auth.service';

import { User } from '../user.class'

@Component({
  moduleId: module.id,
  templateUrl: './forgot.component.html',
})
export class ForgotComponent {

  forgotForm: FormGroup;
  user = new User();

  submitted = false;
  submitErrorMessage = '';

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) {
    this.createforgotForm();
  }

  createforgotForm() {
    this.forgotForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', [
        Validators.required,
        this.equalsValidatorFactory('password', 'passwordMismatch')
      ]]
    })
  }

  /** Called by form submission **/
  onSubmit() {

    // Else mark form as submitted and populate the user
    this.submitted = true;
    this.submitErrorMessage = '';
    this.user.lastName = this.forgotForm.get('lastName').value;
    this.user.firstName = this.forgotForm.get('firstName').value;
    this.user.username = this.forgotForm.get('username').value;
    this.user.password = this.forgotForm.get('password').value;

    return this.authService.forgot(this.user)
      .subscribe(
        () => console.log('successfully reset password!'), //TODO
        err => {
          this.submitted = false;
          this.submitErrorMessage = err.message;
        });
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

  /** Called by keyup on password - validates that password still matches **/
  revalidateConfirm() {
    this.forgotForm.get('passwordConfirm').updateValueAndValidity();
  }
}
