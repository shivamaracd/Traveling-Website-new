import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashStatusComponent } from './cash-status/cash-status.component';
import { CashTypeComponent } from './cash-type/cash-type.component';
import { CourtComponent } from './court/court.component';
import { CourtTypeComponent } from './court-type/court-type.component';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
import { JudgeComponent } from './judge/judge.component';
import { TaxComponent } from './tax/tax.component';
import { AddTaxComponent } from './add-tax/add-tax.component';

const routes: Routes = [
  {path:'', component:CashStatusComponent},
  {path:'cash-status', component:CashStatusComponent},
  {path:'cash-type', component:CashTypeComponent},
  {path:'court', component:CourtComponent},
  {path:'court-type', component:CourtTypeComponent},
  {path:'general-setting', component:GeneralSettingComponent},
  {path:'judge', component:JudgeComponent},
  {path:'tax', component:TaxComponent},
  {path:'add-tax', component:AddTaxComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
