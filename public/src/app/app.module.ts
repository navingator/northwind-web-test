/** Angular Modules **/
import { NgModule }        from '@angular/core';
import { BrowserModule }   from '@angular/platform-browser';
import { MaterialModule }  from '@angular/material';

/** Routing Module **/
import { AppRoutingModule }  from './app-routing.module';

/** Feature Modules **/
import { UserModule }    from './user/user.module';
import { ProductModule }    from './product/product.module';
import { ProdCatModule }  from './product_category/product-category.module'


/** Components **/
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    UserModule,
    ProductModule,
    ProdCatModule,
    MaterialModule,

    AppRoutingModule // Must be last
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
