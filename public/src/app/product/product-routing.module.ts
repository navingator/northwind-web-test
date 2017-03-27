import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProdListComponent } from './list/product-list.component';
import { ProdNewComponent }  from './new/product-new.component';

const routes: Routes = [
  { path: 'product',     component: ProdListComponent },
  { path: 'product/new', component: ProdNewComponent }
]

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProductRoutingModule {}
