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
import { SignupCongratsComponent } from './signup-congrats/signup-congrats.component';

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
    SignupCongratsComponent
  ],
  providers: [
    UserAuthService
  ]
})
export class UserModule { }
