import { Component } from '@angular/core';
import { Router }    from '@angular/router';

import { AuthService } from '../auth.service';

import { User } from '../user.class';

@Component({
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = new User();
  submitted = false;
  submitErrorMessage = '';
  usernameNotFound = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.submitted = true;
    this.authService.authenticate(this.user)
      .subscribe(
        this.authService.goToHome,
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
