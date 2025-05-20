import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch/branch.component';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgToastModule } from 'ng-angular-popup';


@NgModule({
  declarations: [
    BranchComponent,
    AddBranchComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    NgToastModule
  ]
})
export class BranchModule { }
