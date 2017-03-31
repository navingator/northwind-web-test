/** Angular Modules **/
import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }          from '@angular/http';
import { MaterialModule }      from '@angular/material';

import 'hammerjs';

/** Routing Module **/
import { ProductRoutingModule } from './product-routing.module';

/** Components **/
import { ProdListComponent } from './list/product-list.component';
import { ProdNewComponent }  from './new/product-new.component';
import { ProdUpdateComponent } from './update/product-update.component'

/** Services **/
import { ProductService } from './product.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,

    ProductRoutingModule //Must be last
  ],
  declarations: [
    ProdListComponent,
    ProdNewComponent,
    ProdUpdateComponent
  ],
  providers: [
    ProductService
  ]
})
export class ProductModule { }
