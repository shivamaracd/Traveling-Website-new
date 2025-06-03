import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { AddReportComponent } from './add-report/add-report.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { ReciptComponent } from './recipt/recipt.component';
import { PickupComponent } from './pickup/pickup.component';
import { MisReportComponent } from './mis-report/mis-report.component';
import { StatusReportComponent } from './status-report/status-report.component';

const routes: Routes = [
  {path:'',component:ReportComponent},
  {path:'report',component:ReportComponent},
  {path:'add',component:AddReportComponent},
  {path:'deliveries',component:DeliveriesComponent},
  {path:'recipt',component:ReciptComponent},
  {path:'picup-report',component:PickupComponent},
  {path:'mis-report',component:MisReportComponent},
  {path:'status-report',component:StatusReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
