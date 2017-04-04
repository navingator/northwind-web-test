import {Injectable}                                   from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router,
        RouterStateSnapshot}                          from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class UnAuthNGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkNotLoggedIn();
  }

  /**
   * Checks whether a user is not authenticated, redirecting if they are authenticated
   * @return {Observable<boolean>} Observable that emits to whether the user is NOT logged in
   */
  public checkNotLoggedIn(): Observable<boolean> {
    return this.authService.checkLogin()
      .do(auth => {
        if (auth) {
          this.router.navigate(['/signup-congrats']);
        }
      })
      .map(auth => !auth); // returns false to the route if the user is logged in
  }
}
