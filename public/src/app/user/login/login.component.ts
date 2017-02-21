import { Component } from '@angular/core';

import { UserAuthService } from '../user-auth.service'

class User {
  username: string;
  password: string;
}

@Component({
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private userAuthService: UserAuthService) {}

  user = new User();
  submitted = false;

  onSubmit() {
    this.submitted = true;
    this.userAuthService.authenticate(username, password);
  }
}
