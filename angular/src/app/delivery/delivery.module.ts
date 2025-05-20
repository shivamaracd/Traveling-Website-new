import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryComponent } from './delivery/delivery.component';
import { AddDeliveryComponent } from './add-delivery/add-delivery.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DeliveryComponent,
    AddDeliveryComponent
  ],
  imports: [
    CommonModule,
    DeliveryRoutingModule,
    ReactiveFormsModule
  ]
})
export class DeliveryModule { }
