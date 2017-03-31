import { Injectable }                              from '@angular/core';
import { Headers, Response, RequestOptions, Http } from '@angular/http';
import { Router }                                  from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { ApiHelperService } from '../core/api-helper.service';

import { User } from './user.class';

@Injectable()
export class AuthService {

  user: User;
  usersUrl = '/api/users';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  /** Observables for notifying user authentication changes **/
  private authSource = new Subject<User>();
  auth$ = this.authSource.asObservable();

  // Redirect URL for redirection after login
  redirectURL: string;

  constructor(
    private http: Http,
    private router: Router,
    private apiHelper: ApiHelperService,
  ) {}

  /**
   * Calls the users api to create a user in the database. Throws any errors
   * that the server returns.
   * @param  {User}             user User object with required fields
   * @return {Observable<User>}      RxJS Observable that emits user information
   * SIDE EFFECTS: logs the user in and sets the this.user
   */
  createUser(user: User): Observable<User> {
    return this.http.post(this.usersUrl, JSON.stringify(user), this.options)
      .map(this.apiHelper.extractData)
      .do(this.addUser)
      .catch(this.apiHelper.handleError);

  }

  /**
   * Checks if the user is logged in.
   * @return {Observable<boolean>} Emits User upon completion
   * SIDE EFFECTS: Sets this.user
   */
  checkLogin(): Observable<boolean> {
    return this.http.get(this.usersUrl + '/me')
      .map(this.apiHelper.extractData)
      .do(this.addUser)
      .map(() => true)
      .catch(() => {
        this.removeUser;
        return Observable.of(false);
      });
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
      .do(this.addUser)
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users api to sign out the user
   * @return {Observable}      RxJS Observable that emits upon completion
   */
  signout(): Observable {
    return this.http.post(this.usersUrl + '/signout', null, this.options)
      .do(this.removeUser)
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users api to reset a user's password. Throws errors that the server
   * returns
   * @param  {User}       user User object with identifiers and new password attached
   * @return {Observable}      RxJS Observable that emits new information
   */
  forgot(user: User): Observable {
    return this.http.post(this.usersUrl + '/forgot', JSON.stringify(user), this.options)
      .do(this.removeUser)
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users API to make the current logged in user an admin.
   * @param  {User}             user User object that is not an admin
   * @return {Observable<User>}      Observable that emits the user when successful
   */
  makeAdmin(user: User): Observable<User> {
    return this.http.post(this.usersUrl + '/adminplease')
      .map(this.apiHelper.extractData)
      .do(this.addUser)
      .catch(this.apiHelper.handleError);
  }

  /**
   * Helper function using the router to navigate to the home page when authenticated
   */
  goToHome = (): void => {
    this.router.navigate(['/signup-congrats']);
  };

  /**
   * Helper function using the router to navigate to signin when signed out
   */
  goToSignin = (): void => {
    this.router.navigate(['/signin']);
  };

  /**
   * Helper function that should be called when a user is added. Sets the
   * service's user and notifies subscribers that the user was added
   * @param  {User} user User object that was added
   */
  private addUser = (user: User): void => {
    this.user = user;
    this.authSource.next(user);
  }

  /**
   * Helper function that should be called when a user is removed. Removes the
   * service's user and notifies subscribers that the user was removed
   * @param  {User} user User object that was removed
   */
  private removeUser: void = () => {
    delete this.user;
    this.authSource.next(null);
  }
}
