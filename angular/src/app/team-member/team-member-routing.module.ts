import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberComponent } from './member/member.component';
import { AddMemberComponent } from './add-member/add-member.component';

const routes: Routes = [
  {path:'', component:MemberComponent},
  {path:'team', component:MemberComponent},
  {path:'add', component:AddMemberComponent},
  {path:'edit/:id', component:AddMemberComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberRoutingModule { }
