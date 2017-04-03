import {Injectable}                                   from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router,
        RouterStateSnapshot}                          from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthNGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    return this.checkLogin(url);
  }

  /**
   * Checks if the user is logged in. If not, routes the user to the signin page
   * and stores the redirect URL for future use
   * @param  {string}              url URL to redirect to, upon login success
   * @return {Observable<boolean>}     Observable that emits whether the user is logged in
   */
  public checkLogin(url: string): Observable<boolean> {
    return this.authService.checkLogin()
      .do(auth => {
        if (!auth) {
          this.authService.redirectUrl = url;
          this.router.navigate(['/signin']);
        }
      });
  }
}
