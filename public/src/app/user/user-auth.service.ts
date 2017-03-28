import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from './user.class';

@Injectable()
export class UserAuthService {

  user: User;
  usersUrl = '/api/users';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http,
  ) {}

  /**
   * Calls the users api to create a user in the database. Throws any errors
   * that the server returns.
   * @param  {User}       user User object with required fields
   * @return {Observable}      RxJS Observable that contains user information
   * SIDE EFFECTS: logs the user in
   */
  createUser(user: User): Observable<User> {
    return this.http.post(this.usersUrl, JSON.stringify(user), this.options)
      .map(this.extractData)
      .map(user => this.user = user)
      .catch(this.handleError);

  }

  authenticate(user: User) {
    return this.http.post(this.usersUrl+"/signin", JSON.stringify(user), this.options)
      .map(this.extractData)
      .map(user => this.user = user)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  /**
   * Handles errors returned from the API
   * @param  {Response}   error Error as a Response object (from API)
   * @return {Observable}       Observable that immediately errors with an error object
   */
  private handleError (error: Response) {
    let err: any;
    if (error instanceof Response) {
      err = error.json() || '';
    } else {
      err = error;
    }
    err.message = err.message || 'An error has occured. Please check your connection and try again.'
    return Observable.throw(err);
  }
}
