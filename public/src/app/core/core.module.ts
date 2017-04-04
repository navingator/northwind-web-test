import { NgModule }     from '@angular/core';

import { CommonModule } from '@angular/common';

import { ApiHelperService } from './api-helper.service';
import { DialogService } from './dialog.service';

@NgModule({
  providers: [ApiHelperService, DialogService]
})
export class CoreModule { }
