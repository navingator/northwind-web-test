import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthNGuard } from '../user/authn-guard.service';

import { CatListComponent} from './list/category-list.component';
import { CatNewComponent } from './new/category-new.component';

import { ProdListComponent } from '../product/list/product-list.component';

const routes: Routes = [
  { path: 'category', canActivate: [AuthNGuard], component: CatListComponent},
  { path: 'category/new', component: CatNewComponent },
  { path: 'category/:id/products', canActivate: [AuthNGuard], component: ProdListComponent }
];

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProdCatRoutingModule {}
