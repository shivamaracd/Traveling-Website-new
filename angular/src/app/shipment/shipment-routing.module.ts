import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipmentComponent } from './shipment/shipment.component';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { ImportBookingComponent } from './import-booking/import-booking.component';

const routes: Routes = [
  {path : '', component:ShipmentComponent},
  {path:'shipment', component:ShipmentComponent},
  {path : 'add', component:AddShipmentComponent},
  {path : 'edit/:id', component:AddShipmentComponent},
  {path : 'import', component:ImportBookingComponent},
  {path : 'report', component:AddShipmentComponent},
  {path : 'update', component:ShipmentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
