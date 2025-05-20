import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipmentComponent } from './shipment/shipment.component';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';

const routes: Routes = [
  {path : '', component:ShipmentComponent},
  {path:'shipment', component:ShipmentComponent},
  {path : 'add', component:AddShipmentComponent},
  {path : 'edit/:id', component:AddShipmentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
