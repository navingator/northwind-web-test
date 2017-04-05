import { Component, OnChanges }               from '@angular/core';
import { AbstractControl, FormBuilder, FormControl,
  FormGroup, Validators}                      from '@angular/forms';

import { Router }                             from '@angular/router';

import { AuthService } from '../auth.service';

import { User } from '../user.class';

@Component({
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {

  public forgotForm: FormGroup;
  public user = new User();

  public submitted = false;
  public submitErrorMessage = '';
  public resetSuccessful = false;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) {
    this.createforgotForm();
  }

  public createforgotForm(): void {
    this.forgotForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', [
        Validators.required,
        this.equalsValidatorFactory('password', 'passwordMismatch')
      ]]
    });
  }

  /**
   * Called upon form submission. Calls AuthService to reset password.
   */
  public onSubmit(): void {

    // Else mark form as submitted and populate the user
    this.submitted = true;
    this.submitErrorMessage = '';
    this.user.lastName = this.forgotForm.get('lastName').value;
    this.user.firstName = this.forgotForm.get('firstName').value;
    this.user.username = this.forgotForm.get('username').value;
    this.user.password = this.forgotForm.get('password').value;

    this.authService.forgot(this.user)
      .subscribe(
        () => this.resetSuccessful = true,
        err => {
          this.submitted = false;
          this.submitErrorMessage = err.message;
        });
  }

  /**
   * Called by keyup on password - validates that password still matches
   */
  public revalidateConfirm(): void {
    this.forgotForm.get('passwordConfirm').updateValueAndValidity();
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
}
