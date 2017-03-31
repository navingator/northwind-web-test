import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatNewComponent } from './new/category-new.component';
import { CatListComponent} from './list/category-list.component';
import { ProdListComponent } from '../product/list/product-list.component'

const routes: Routes = [
  { path: 'category', component: CatListComponent},
  { path: 'category/new', component: CatNewComponent },
  { path: 'category/:id/products', component: ProdListComponent }
]

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProdCatRoutingModule {}
