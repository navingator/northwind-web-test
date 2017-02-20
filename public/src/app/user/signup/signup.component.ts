import { Component } from '@angular/core';

class NewUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

@Component({
  moduleId: module.id,
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  newUser = new NewUser();
}
