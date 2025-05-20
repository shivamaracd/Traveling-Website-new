import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { AddReportComponent } from './add-report/add-report.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReportComponent,
    AddReportComponent,
    DeliveriesComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    ReactiveFormsModule
  ]
})
export class ReportModule { }
