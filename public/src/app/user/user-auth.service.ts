import { Injectable }                              from '@angular/core';
import { Headers, Response, RequestOptions, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { ApiHelperService } from '../core/api-helper.service';

import { User } from './user.class';

@Injectable()
export class UserAuthService {

  user: User;
  usersUrl = '/api/users';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http,
    private apiHelper: ApiHelperService
  ) {}

  /**
   * Calls the users api to create a user in the database. Throws any errors
   * that the server returns.
   * @param  {User}              ser User object with required fields
   * @return {Observable<User>}      RxJS Observable that emits user information
   * SIDE EFFECTS: logs the user in and sets the this.user
   */
  createUser(user: User): Observable<User> {
    return this.http.post(this.usersUrl, JSON.stringify(user), this.options)
      .map(this.apiHelper.extractData)
      .do(user => this.user = user)
      .catch(this.apiHelper.handleError);

  }

  /**
   * Checks if the user is logged in.
   * @return {Observable<User>} Emits User upon completion
   * SIDE EFFECTS: Sets this.user
   */
  checkLogin(): Observable<User> {
    return this.http.get(this.usersUrl + '/me')
      .map(this.apiHelper.extractData)
      .do(user => this.user = user)
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users api to authenticate a user in the database. Throws any errors
   * that the server returns
   * @param  {User}       user User object with username and password
   * @return {Observable}      RxJS Observable that emits upon completion
   */
  authenticate(user: User): Observable<User> {
    return this.http.post(this.usersUrl + '/signin', JSON.stringify(user), this.options)
      .map(this.apiHelper.extractData)
      .do(user => this.user = user)
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users api to sign out the user
   * @return {Observable}      RxJS Observable that emits upon completion
   */
  signout() {
    return this.http.post(this.usersUrl + '/signout', null, this.options)
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users api to reset a user's password. Throws errors that the server
   * returns
   * @param  {User}       user User object with identifiers and new password attached
   * @return {Observable}      RxJS Observable that emits new information
   */
  forgot(user: User) {
    return this.http.post(this.usersUrl + '/forgot', JSON.stringify(user), this.options)
      .do(() => delete this.user)
      .catch(this.apiHelper.handleError);
  }
}
