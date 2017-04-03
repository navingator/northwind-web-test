import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

@Injectable()
export class ApiHelperService {

  /**
   * Handles errors returned from the API. Navigates the user to the signin page,
   * if the user attempts to perform an action that requires authentication.
   * @param  {Response}   error Error as a Response object (from API)
   * @return {Observable}       Observable that immediately errors with an error object
   */
  public handleError = (error: Response) => {
    let err: any;
    if (error instanceof Response) {
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
  public extractData(res: Response): any {
    const body = res.json();
    return body || { };
  }
}
