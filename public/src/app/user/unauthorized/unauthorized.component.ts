import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  moduleId: module.id,
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {

  signoutError = false;
  adminError = false;
  adminSuccess = false;
  showAdminButton = false;
  submitted = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.checkLogin()
      .subscribe(
        auth => {
          if (auth) {
            let user = this.authService.user;
            this.showAdminButton = !user.isAdmin; // show the button if the user is not an admin
          }
        }
      )
  }

  makeAdmin = function() {
    this.submitted = true;
    this.authService.makeAdmin()
      .subscribe(
        () => {
          this.showAdminButton = false;
          this.adminError = false;
          this.adminSuccess = true;
        },
        () => {
          this.adminError = true;
          this.submitted = false;
        }
      )
  }

}
