import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipmentRoutingModule } from './shipment-routing.module';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddShipmentComponent,
    ShipmentComponent,
    
  ],
  imports: [
    CommonModule,
    ShipmentRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ShipmentModule { }
