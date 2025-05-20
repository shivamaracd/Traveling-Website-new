import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { AddReportComponent } from './add-report/add-report.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';

const routes: Routes = [
  {path:'',component:ReportComponent},
  {path:'report',component:ReportComponent},
  {path:'add',component:AddReportComponent},
  {path:'deliveries',component:DeliveriesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
