import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  moduleId: module.id,
  templateUrl: './signout.component.html',
})
export class SignoutComponent implements OnInit {

  signoutError = false;
  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.signout()
      .subscribe(
        this.authService.goToSignin,
        () => this.signoutError = true
      )
  }
}
