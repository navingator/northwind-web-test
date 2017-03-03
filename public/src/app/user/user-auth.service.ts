import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Router } from '@angular/router'

import 'rxjs/add/operator/toPromise';

import { User } from './user.class';

@Injectable()
export class UserAuthService {
usersUrl = 'api/users';

constructor(
  private http: Http,
  private router: Router
){}

  createUser(user: User) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log("User: ", user.firstName + " " + user.lastName);
    console.log(JSON.stringify(user));

    return this.http
      .post(this.usersUrl, JSON.stringify(user), options)
      .toPromise()
      .then(() => this.router.navigate(['/signup-congrats']))
      .catch(error => console.log(error)); //* TODO make sure username is unique and error handle for all errors
  }

  authenticate(user: User) {
    console.log("Authenticated ", user.username);
  }
}
