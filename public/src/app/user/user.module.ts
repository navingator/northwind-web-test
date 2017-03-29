/** Angular Modules **/
import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }          from '@angular/http';

/** Routing Module **/
import { UserRoutingModule } from './user-routing.module';

/** Components **/
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SignoutComponent } from './signout/signout.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SignupCongratsComponent } from './signup_congrats/signup-congrats.component';

/** Services **/
import { UserAuthService } from './user-auth.service';

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
    SignupCongratsComponent
  ],
  providers: [
    UserAuthService
  ]
})
export class UserModule { }
