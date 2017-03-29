import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router }     from '@angular/router';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiHelperService {

  constructor(
    private router: Router
  ) {}
  /**
   * Handles errors returned from the API. Navigates the user to the signin page,
   * if the user attempts to perform an action that requires authentication.
   * @param  {Response}   error Error as a Response object (from API)
   * @return {Observable}       Observable that immediately errors with an error object
   */
  handleError = (error: Response) => {
    let err: any;
    if (error instanceof Response) {
      if (error.status === 401) {
        this.router.navigate(['/signin']);
      }
      err = error.json() || '';
    } else {
      err = error;
    }
    err.message = err.message || 'An error has occurred. Please check your connection and try again.';

    return Observable.throw(err);
  }

  /**
   * Extracts data from API calls, given the response.
   * @param  {Response} res Response object from the API
   * @return {Body}
   */
  extractData(res: Response) {
    let body = res.json();
    return body || { };
  }
}
