/* Angular Modules */
import { NgModule }            from '@angular/core';

import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }          from '@angular/http';
import { MaterialModule }      from '@angular/material';

import 'hammerjs';

/* Routing Module */
import { ProdCatRoutingModule } from './product-category-routing.module';

/* Components */
import { CatListComponent } from './list/category-list.component';
import { CatNewComponent } from './new/category-new.component';

/* Services */
import { ProdCatSearchService } from './prodcat-search.service';
import { ProdCatService } from './prodcat.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    ProdCatRoutingModule // Must be last
  ],
  declarations: [
    CatNewComponent,
    CatListComponent
  ],
  providers: [
    ProdCatService,
    ProdCatSearchService
  ]
})
export class ProdCatModule { }
