import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchComponent } from './branch/branch.component';
import { AddBranchComponent } from './add-branch/add-branch.component';


const routes: Routes = [
  {
    path: 'branch',
    component: BranchComponent
  },
  {
    path: 'add-branch',
    component: AddBranchComponent
  },
  {
    path: 'edit-branch/:id',
    component: AddBranchComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
