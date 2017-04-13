// Angular Modules
import { CommonModule }        from '@angular/common';
import { NgModule }            from '@angular/core';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }          from '@angular/http';
import { MaterialModule }      from '@angular/material';

import 'hammerjs';

// Dependency Modules
import { CategoryModule } from '../category/category.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';

// Routing Module
import { ProductRoutingModule } from './product-routing.module';

// Components
import { ProductListComponent }       from './list/product-list.component';
import { ProductEditComponent }     from './edit/product-edit.component';
import { ProductDetailComponent }     from './detail/product-detail.component';

// Services
import { ProductService }       from './product.service';
import { ProductChangeService } from './product-change.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    UserModule,
    CategoryModule,
    SharedModule,

    ProductRoutingModule // must be last
  ],
  declarations: [
    ProductListComponent,
    ProductEditComponent,
    ProductDetailComponent
  ],
  providers: [
    ProductService,
    ProductChangeService
  ]
})
export class ProductModule { }
