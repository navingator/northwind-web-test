import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signout.component.html'
})
export class SignoutComponent implements OnInit {

  public signoutError = false;
  constructor(
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.authService.signout()
      .subscribe(
        () => this.authService.goToSignin(),
        () => this.signoutError = true
      );
  }
}
