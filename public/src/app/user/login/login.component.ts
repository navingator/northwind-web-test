import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';

class User {
  username: string;
  password: string;
}

@Component({
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent {
  user = new User();
}
