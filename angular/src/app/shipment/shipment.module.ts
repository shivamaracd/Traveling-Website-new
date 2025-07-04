import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipmentRoutingModule } from './shipment-routing.module';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportBookingComponent } from './import-booking/import-booking.component';
import { NgToastModule } from 'ng-angular-popup';

@NgModule({
  declarations: [
    AddShipmentComponent,
    ShipmentComponent,
    ImportBookingComponent,
  ],
  imports: [
    CommonModule,
    ShipmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule
  ]
})
export class ShipmentModule { }
