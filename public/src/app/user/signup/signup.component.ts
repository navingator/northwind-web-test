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
      passwordConfirm: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.markAllTouched(this.signupForm);
      console.log("made it!");
      return;
    }
    this.submitted = true;
    this.userAuthService.createUser(
      this.signupForm.get('lastName').value,
      this.signupForm.get('firstName').value,
      this.signupForm.get('username').value,
      this.signupForm.get('password').value
    )
  }

  private markAllTouched(control: AbstractControl) {
    if(control.hasOwnProperty('controls')) {
      control.markAsTouched(true) // mark group
      let ctrl = <any>control;
      for (let inner in ctrl.controls) {
        this.markAllTouched(ctrl.controls[inner] as AbstractControl);
      }
    }
    else {
      (<FormControl>(control)).markAsTouched(true);
    }
  }
}
