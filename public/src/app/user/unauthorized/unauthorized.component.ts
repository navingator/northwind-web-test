import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  moduleId: module.id,
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {

  public signoutError = false;
  public adminError = false;
  public adminSuccess = false;
  public showAdminButton = false;
  public submitted = false;

  constructor(
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.authService.checkLogin()
      .subscribe(
        auth => {
          if (auth) {
            const user = this.authService.user;
            this.showAdminButton = !user.isAdmin; // show the button if the user is not an admin
          }
        }
      );
  }

  public makeAdmin(): void {
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
      );
  }

}
