import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryComponent } from './delivery/delivery.component';
import { AddDeliveryComponent } from './add-delivery/add-delivery.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeliveryImportComponent } from './delivery-import/delivery-import.component';


@NgModule({
  declarations: [
    DeliveryComponent,
    AddDeliveryComponent,
    DeliveryImportComponent
  ],
  imports: [
    CommonModule,
    DeliveryRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DeliveryModule { }
