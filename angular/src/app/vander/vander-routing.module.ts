import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VanderComponent } from './vander/vander.component';
import { AddVanderComponent } from './add-vander/add-vander.component';

const routes: Routes = [
  {path : '', component:VanderComponent},
  {path : "vander", component:VanderComponent},
  {path : "add", component:AddVanderComponent},
  {path : "edit/:id", component:AddVanderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VanderRoutingModule { }
