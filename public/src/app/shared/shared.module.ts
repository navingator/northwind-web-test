import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NoticeComponent } from './notice/notice.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    NoticeComponent,
    NotFoundComponent
  ],
  exports: [
    NoticeComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }
