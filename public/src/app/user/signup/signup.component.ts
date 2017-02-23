import { Component, OnChanges }               from '@angular/core';
import { FormBuilder, FormGroup, Validators,
  AbstractControl, FormControl }              from '@angular/forms';

import { UserAuthService } from '../user-auth.service';

@Component({
  moduleId: module.id,
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupForm: FormGroup;

  submitted = false;
  submitError = false;

  constructor(
      private fb: FormBuilder,
      private userAuthService: UserAuthService
    ) {
    this.createSignupForm();
  }

  createSignupForm() {
    this.signupForm = this.fb.group({
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

  onSubmit() {
    if (this.signupForm.invalid) {
      this.markAllDirty(this.signupForm);
      this.submitError = true;
      return;
    }
    this.submitted = true;
    this.submitError = false;
    this.userAuthService.createUser(
      this.signupForm.get('lastName').value,
      this.signupForm.get('firstName').value,
      this.signupForm.get('username').value,
      this.signupForm.get('password').value
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
    this.signupForm.get('passwordConfirm').updateValueAndValidity();
  }
}
