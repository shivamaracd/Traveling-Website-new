import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { AddReportComponent } from './add-report/add-report.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReciptComponent } from './recipt/recipt.component';
import { PickupComponent } from './pickup/pickup.component';
import { MisReportComponent } from './mis-report/mis-report.component';
import { StatusReportComponent } from './status-report/status-report.component';
import { PrintReceiptComponent } from './print-receipt/print-receipt.component';


@NgModule({
  declarations: [
    ReportComponent,
    AddReportComponent,
    DeliveriesComponent,
    ReciptComponent,
    PickupComponent,
    MisReportComponent,
    StatusReportComponent,
    PrintReceiptComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ReportModule { }
