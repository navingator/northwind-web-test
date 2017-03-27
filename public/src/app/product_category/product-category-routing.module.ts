import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatNewComponent } from './new/category-new.component';
import { CatListComponent} from './list/category-list.component'

const routes: Routes = [
  { path: 'category', component: CatListComponent},
  { path: 'category/new', component: CatNewComponent }
]

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProdCatRoutingModule {}
