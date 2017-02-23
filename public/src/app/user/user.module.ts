/** Angular Modules **/
import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'

/** Routing Module **/
import { UserRoutingModule } from './user-routing.module';

/** Components **/
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

/** Services **/
import { UserAuthService } from './user-auth.service'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  providers: [
    UserAuthService
  ]
})
export class UserModule { }
