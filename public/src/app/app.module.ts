/** Angular Modules **/
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/** Routing Module **/
import { AppRoutingModule } from './app-routing.module';

/** Feature Modules **/
import { UserModule }       from './user/user.module';

/** Components **/
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    UserModule,

    AppRoutingModule // Must be last
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
