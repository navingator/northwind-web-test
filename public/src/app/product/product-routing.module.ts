import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthNGuard } from '../user/authn-guard.service';

import { ProdListComponent }   from './list/product-list.component';
import { ProdUpdateComponent } from './update/product-update.component';
import { ProdDetailComponent } from './detail/product-detail.component';

import { CatListComponent} from '../product_category/list/category-list.component';

// TODO handle invalid product ID
const routes: Routes = [
  { path: 'products', canActivate: [AuthNGuard], component: ProdListComponent, children: [
    {
      path: 'new',
      component: ProdUpdateComponent
    },
    {
      path: 'edit/:productId',
      component: ProdUpdateComponent
    },
    {
      path: 'detail/:productId',
      component: ProdDetailComponent
    }
  ]},
  { path: 'categories', component: CatListComponent },
];

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProductRoutingModule {}
