import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseRoutingModule } from './case-routing.module';
import { AddCaseComponent } from './add-case/add-case.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddCaseComponent
  ],
  imports: [
    CommonModule,
    CaseRoutingModule,
    ReactiveFormsModule
  ]
})
export class CaseModule { }
