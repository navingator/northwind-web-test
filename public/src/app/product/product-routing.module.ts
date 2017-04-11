import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthNGuard } from '../user/authn-guard.service';

import { ProductListComponent }   from './list/product-list.component';
import { ProductEditComponent } from './edit/product-edit.component';
import { ProductDetailComponent } from './detail/product-detail.component';

// TODO handle invalid product ID
const routes: Routes = [
  { path: 'products', canActivate: [AuthNGuard], component: ProductListComponent, children: [
    {
      path: 'new',
      component: ProductEditComponent
    },
    {
      path: 'edit/:productId',
      component: ProductEditComponent
    },
    {
      path: 'detail/:productId',
      component: ProductDetailComponent
    }
  ]}
];

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProductRoutingModule {}
