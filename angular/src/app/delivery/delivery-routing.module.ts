import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryComponent } from './delivery/delivery.component';
import { AddDeliveryComponent } from './add-delivery/add-delivery.component';

const routes: Routes = [
  {path:'', component:DeliveryComponent},
  {path:'delivery', component:DeliveryComponent},
  {path:'add', component:AddDeliveryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule { }
