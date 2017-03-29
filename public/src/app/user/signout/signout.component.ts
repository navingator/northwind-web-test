import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router'

import { UserAuthService } from '../user-auth.service';

@Component({
  moduleId: module.id,
  templateUrl: './signout.component.html',
})
export class SignoutComponent implements OnInit {

  constructor(
    private userService: UserAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.signout()
      .subscribe(() => this.router.navigate(['/signin']));
  }
}
