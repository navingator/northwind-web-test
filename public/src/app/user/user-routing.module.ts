import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { SignoutComponent } from './signout/signout.component';
import { SignupComponent } from './signup/signup.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { SignupCongratsComponent } from './signup_congrats/signup-congrats.component';

/* Guards */
import { AuthNGuard } from './authn-guard.service';
import { AuthZGuard } from './authz-guard.service';
import { UnAuthNGuard } from './unauthn-guard.service';

const routes: Routes = [
  { path: 'signin', canActivate: [UnAuthNGuard], component: LoginComponent },
  { path: 'signup', canActivate: [UnAuthNGuard], component: SignupComponent },
  { path: 'signout', component: SignoutComponent },
  { path: 'forgot', canActivate: [UnAuthNGuard], component: ForgotComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'signup-congrats', canActivate: [AuthNGuard], component: SignupCongratsComponent}
];

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: [ AuthNGuard, AuthZGuard, UnAuthNGuard ]
})
export class UserRoutingModule {}
