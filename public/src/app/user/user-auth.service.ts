import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserAuthService {
  createUser(lastName:string, firstName:string, username:string, password:string): void {
    console.log("User: ", firstName + " " + lastName);
  }

  authenticate(username:string, password:string): void {
    console.log("Authenticated ", username);
  }
}
