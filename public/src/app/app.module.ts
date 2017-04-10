/** Angular Modules */
import { NgModule }        from '@angular/core';
import { MaterialModule }  from '@angular/material';
import { BrowserModule }   from '@angular/platform-browser';

/** Core Module */
import { CoreModule } from './core/core.module';

/** Routing Module */
import { AppRoutingModule }  from './app-routing.module';

/** Feature Modules */
import { ProductModule }    from './product/product.module';
import { CategoryModule }  from './category/category.module';
import { UserModule }    from './user/user.module';

/** Components */
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    UserModule,
    CategoryModule,
    ProductModule,
    MaterialModule,

    AppRoutingModule // Must be last
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
