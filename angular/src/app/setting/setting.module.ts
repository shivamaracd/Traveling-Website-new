import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { CashTypeComponent } from './cash-type/cash-type.component';
import { CourtTypeComponent } from './court-type/court-type.component';
import { CourtComponent } from './court/court.component';
import { CashStatusComponent } from './cash-status/cash-status.component';
import { JudgeComponent } from './judge/judge.component';
import { TaxComponent } from './tax/tax.component';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddTaxComponent } from './add-tax/add-tax.component';


@NgModule({
  declarations: [
    CashTypeComponent,
    CourtTypeComponent,
    CourtComponent,
    CashStatusComponent,
    JudgeComponent,
    TaxComponent,
    GeneralSettingComponent,
    AddTaxComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SettingModule { }
