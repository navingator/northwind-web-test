/** Angular Modules **/
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';

/** Routing Module **/
import { UserRoutingModule } from './user-routing.module';

/** Components **/
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent
  ]
})
export class UserModule { }
