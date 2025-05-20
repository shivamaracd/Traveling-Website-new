import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseListComponent } from './case-list/case-list.component';
import { AddCaseComponent } from './add-case/add-case.component';

const routes: Routes = [
  {path:'', component:CaseListComponent},
  {path:'case', component:CaseListComponent},
  {path:'add', component:AddCaseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseRoutingModule { }
