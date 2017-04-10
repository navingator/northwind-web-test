import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthNGuard } from '../user/authn-guard.service';
import { AuthZGuard } from '../user/authz-guard.service';

import { CategoryDetailComponent } from './detail/category-detail.component';
import { CategoryListComponent} from './list/category-list.component';
import { CategoryEditComponent } from './edit/category-edit.component';

import { ProdListComponent }   from '../product/list/product-list.component';
import { ProdUpdateComponent } from '../product/update/product-update.component';
import { ProdDetailComponent } from '../product/detail/product-detail.component';

// TODO handle invalid category ID
const routes: Routes = [
  { path: 'categories', canActivate: [AuthNGuard], component: CategoryListComponent, children: [
    {
      path: 'new',
      canActivate: [AuthZGuard],
      component: CategoryEditComponent
    },
    {
      path: 'edit/:categoryId',
      canActivate: [AuthZGuard],
      component: CategoryEditComponent
    },
    {
      path: 'detail/:categoryId',
      component: CategoryDetailComponent
    }
  ]},
  { path: 'categories/:id/products', canActivate: [AuthNGuard], component: ProdListComponent, children: [
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
];

@NgModule ({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CategoryRoutingModule {}
