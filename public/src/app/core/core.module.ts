import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiHelperService } from './api-helper.service';
import { DialogService } from './dialog.service';
import { ErrorService } from './error.service';
import { FormHelperService } from './form-helper.service';

@NgModule({
  providers: [
    ApiHelperService,
    DialogService,
    ErrorService,
    FormHelperService,
  ]
})
export class CoreModule { }
