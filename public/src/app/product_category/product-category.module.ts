/** Angular Modules **/
import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }          from '@angular/http';
import { MaterialModule }      from '@angular/material';

import 'hammerjs';

/** Routing Module **/
import { ProdCatRoutingModule } from './product-category-routing.module';

/** Components **/
import { CatNewComponent } from './new/category-new.component';
import { CatListComponent } from './list/category-list.component';

/** Services **/

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    ProdCatRoutingModule //Must be last
  ],
  declarations: [
    CatNewComponent,
    CatListComponent
  ],
})
export class ProdCatModule { }
