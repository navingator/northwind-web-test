import { Component, OnInit } from '@angular/core';

import { AuthService } from './user/auth.service';
import { User } from './user/user.class';

@Component({
  templateUrl: './app.component.html',
  selector: 'northwind-app',
})

export class AppComponent implements OnInit {
  public user: User;

  constructor(
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.authService.auth$.subscribe(user => this.user = user);
  }
}
