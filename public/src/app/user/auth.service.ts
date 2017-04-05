import { Injectable }                              from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { NavigationExtras, Router }                from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { ApiHelperService } from '../core/api-helper.service';

import { User } from './user.class';

@Injectable()
export class AuthService {

  public user: User;
  public usersUrl = '/api/users';
  // Redirect URL for redirection after login
  public redirectUrl: string;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  /* Observables for notifying user authentication changes */
  private authSource = new Subject<User>();
  public auth$ = this.authSource.asObservable(); // tslint:disable-line

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
  public createUser(user: User): Observable<User> {
    return this.http.post(this.usersUrl, JSON.stringify(user), this.options)
      .map(this.apiHelper.extractData)
      .do(apiUser => this.addUser(apiUser))
      .catch(this.apiHelper.handleError);

  }

  /**
   * Checks if the user is logged in.
   * @return {Observable<boolean>} Emits User upon completion
   * SIDE EFFECTS: Sets this.user
   */
  public checkLogin(): Observable<boolean> {
    return this.http.get(this.usersUrl + '/me')
      .map(this.apiHelper.extractData)
      .map(user => {
        if (user.hasOwnProperty('username')) {
          this.addUser(user);
          return true;
        } else {
          this.removeUser();
          return false;
        }
      })
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users api to authenticate a user in the database. Throws any errors
   * that the server returns
   * @param  {User}       user User object with username and password
   * @return {Observable}      RxJS Observable that emits upon completion
   */
  public authenticate(user: User): Observable<User> {
    return this.http.post(this.usersUrl + '/signin', JSON.stringify(user), this.options)
      .map(this.apiHelper.extractData)
      .do(apiUser => this.addUser(apiUser))
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users api to sign out the user
   * @return {Observable}      RxJS Observable that emits upon completion
   */
  public signout(): Observable<Response> {
    return this.http.post(this.usersUrl + '/signout', null, this.options)
      .do(() => this.removeUser())
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users api to reset a user's password. Throws errors that the server
   * returns
   * @param  {User}       user User object with identifiers and new password attached
   * @return {Observable}      RxJS Observable that emits new information
   */
  public forgot(user: User): Observable<Response> {
    return this.http.post(this.usersUrl + '/forgot', JSON.stringify(user), this.options)
      .do(() => this.removeUser())
      .catch(this.apiHelper.handleError);
  }

  /**
   * Calls the users API to make the current logged in user an admin.
   * @param  {User}             user User object that is not an admin
   * @return {Observable<User>}      Observable that emits the user when successful
   */
  public makeAdmin(): Observable<User> {
    return this.http.post(this.usersUrl + '/adminplease', null, null)
      .map(this.apiHelper.extractData)
      .do(user => this.addUser(user))
      .catch(this.apiHelper.handleError);
  }

  /**
   * Helper function using the router to navigate to the home page when authenticated
   */
  public goToHome(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Helper function using the router to navigate to signin when signed out
   */
  public goToSignin(): void {
    this.router.navigate(['/signin']);
  }

  public goToRedirect(): void {
    const redirect = this.redirectUrl ? this.redirectUrl : '/home';

    // Set our navigation extras object
    // that passes on our global query params and fragment
    const navigationExtras: NavigationExtras = {
      preserveQueryParams: true,
      preserveFragment: true
    };

    // Redirect the user
    this.router.navigate([redirect], navigationExtras);
    this.redirectUrl = '';
  }

  /**
   * Helper function that should be called when a user is added. Sets the
   * service's user and notifies subscribers that the user was added
   * @param  {User} user User object that was added
   */
  private addUser(user: User): void {
    this.user = user;
    this.authSource.next(user);
  }

  /**
   * Helper function that should be called when a user is removed. Removes the
   * service's user and notifies subscribers that the user was removed
   * @param  {User} user User object that was removed
   */
  private removeUser(): void {
    delete this.user;
    this.authSource.next(null);
  }
}
