// Angular Modules
import { CommonModule }        from '@angular/common';
import { NgModule }            from '@angular/core';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }          from '@angular/http';
import { MaterialModule }      from '@angular/material';

import 'hammerjs';

// Dependency Modules
import { ProdCatModule } from '../product_category/product-category.module';
import { UserModule }    from '../user/user.module';

// Routing Module
import { ProductRoutingModule } from './product-routing.module';

// Components
import { ProdListComponent }       from './list/product-list.component';
import { ProdUpdateComponent }     from './update/product-update.component';
import { ProdDetailComponent }     from './detail/product-detail.component';

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
    ProdCatModule,

    ProductRoutingModule // must be last
  ],
  declarations: [
    ProdListComponent,
    ProdUpdateComponent,
    ProdDetailComponent
  ],
  providers: [
    ProductService,
    ProductChangeService
  ]
})
export class ProductModule { }
