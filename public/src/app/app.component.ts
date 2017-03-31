import { Component, OnInit } from '@angular/core';

import { AuthService } from './user/auth.service';
import { User } from './user/user.class';

@Component({
  moduleId: module.id,
  templateUrl: './app.component.html',
  selector: 'northwind-app',
})
export class AppComponent implements OnInit {
  user: User;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.auth$.subscribe(user => this.user = user);
  }
}
