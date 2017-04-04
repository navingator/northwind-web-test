import {Injectable}                                   from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router,
        RouterStateSnapshot}                          from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthZGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    return this.checkAuthorization(url);
  }

  /**
   * Checks authentication and authorization, redirecting appropriately.
   * @param  {string}              url URL to redirect to upon successful authentication
   * @return {Observable<boolean>}     Observable that emits whether the user is authorized
   */
  public checkAuthorization(url: string): Observable<boolean> {
    return this.authService.checkLogin()
      .map(authN => {
        if (!authN) {
          this.authService.redirectUrl = url;
          this.router.navigate(['/signin']);
          return false;
        }

        const authZ = this.authService.user.isAdmin;
        if (!authZ) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      });
  }
}
