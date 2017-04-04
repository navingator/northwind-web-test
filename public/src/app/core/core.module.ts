import { CommonModule } from '@angular/common';
import { NgModule }     from '@angular/core';
import { ApiHelperService } from './api-helper.service';

@NgModule({
  providers: [ApiHelperService]
})
export class CoreModule { }
