/* Angular Modules */
import { NgModule }            from '@angular/core';

import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }          from '@angular/http';

/* Routing Module */
import { UserRoutingModule } from './user-routing.module';

/* Components */
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { SignoutComponent } from './signout/signout.component';
import { SignupComponent } from './signup/signup.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { HomeComponent } from './home/home.component';

/* Services */
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    UserRoutingModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    SignoutComponent,
    ForgotComponent,
    UnauthorizedComponent,
    HomeComponent
  ],
  providers: [
    AuthService
  ]
})
export class UserModule { }
