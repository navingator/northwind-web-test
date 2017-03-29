import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component'
import { SignupComponent } from './signup/signup.component';
import { SignoutComponent } from './signout/signout.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SignupCongratsComponent } from './signup_congrats/signup-congrats.component'

const routes: Routes = [
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signout', component: SignoutComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'signup-congrats', component: SignupCongratsComponent}
]

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {}
