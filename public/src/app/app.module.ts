/** Angular Modules **/
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/** Custom Modules **/
import { AppRoutingModule } from './app-routing.module';

/** Components **/
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
