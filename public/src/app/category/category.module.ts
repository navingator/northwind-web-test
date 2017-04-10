/* Angular Modules */
import { NgModule }            from '@angular/core';

import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }          from '@angular/http';
import { MaterialModule }      from '@angular/material';

import 'hammerjs';

/* Dependency modules */
import { UserModule }    from '../user/user.module';

/* Routing Module */
import { CategoryRoutingModule } from './category-routing.module';

/* Components */
import { CategoryDetailComponent } from './detail/category-detail.component';
import { CategoryListComponent } from './list/category-list.component';
import { CategoryEditComponent } from './edit/category-edit.component';

/* Services */
import { CategoryChangeService } from './category-change.service';
import { CategorySearchService } from './category-search.service';
import { CategoryService } from './category.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UserModule,

    CategoryRoutingModule // Must be last
  ],
  declarations: [
    CategoryEditComponent,
    CategoryListComponent,
    CategoryDetailComponent
  ],
  providers: [
    CategoryService,
    CategorySearchService,
    CategoryChangeService
  ]
})
export class CategoryModule { }
