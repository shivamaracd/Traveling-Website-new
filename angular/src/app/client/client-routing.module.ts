import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { AddClientComponent } from './add-client/add-client.component';

const routes: Routes = [
  {path:'', component:ClientComponent},
  {path:'client', component:ClientComponent},
  {path:'add', component:AddClientComponent},
  {path:'edit/:id', component:AddClientComponent}

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
