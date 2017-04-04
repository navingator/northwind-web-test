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
import { CategoryDetailComponent } from './detail/category-detail.component';
import { CatListComponent } from './list/category-list.component';
import { CatEditComponent } from './edit/category-edit.component';

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
    CatEditComponent,
    CatListComponent,
    CategoryDetailComponent
  ],
  providers: [
    ProdCatService,
    ProdCatSearchService
  ]
})
export class ProdCatModule { }
