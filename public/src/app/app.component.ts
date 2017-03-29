import { Component, OnInit } from '@angular/core';

import { UserAuthService } from './user/user-auth.service';
import { User } from './user/user.class';

@Component({
  moduleId: module.id,
  templateUrl: './app.component.html',
  selector: 'northwind-app',
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  user: User;

  constructor(
    private userService: UserAuthService,
  ) {}

  ngOnInit() {
    this.userService.checkLogin()
      .subscribe(
        user => {
          this.isLoggedIn = true;
          this.user = user;
        }
      )
  }
}
