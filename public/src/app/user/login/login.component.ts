import { Component } from '@angular/core';
import { Router }    from '@angular/router';

import { UserAuthService } from '../user-auth.service';

import { User } from '../user.class';

@Component({
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  user = new User();
  submitted = false;
  submitErrorMessage = '';
  usernameNotFound = false;

  onSubmit() {
    this.submitted = true;
    this.userAuthService.authenticate(this.user)
      .subscribe(
        () => this.router.navigate(['/signup-congrats']),
        err => {
          this.submitted = false;
          if (err.code === 1100) {
            this.usernameNotFound = true;
            this.submitErrorMessage = '';
          }
          else {
            this.usernameNotFound = false;
            this.submitErrorMessage = err.message;
          }
        });
  }
}
