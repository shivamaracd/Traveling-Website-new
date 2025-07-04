import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamMemberRoutingModule } from './team-member-routing.module';
import { MemberComponent } from './member/member.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    MemberComponent,
    AddMemberComponent
  ],
  imports: [
    CommonModule,
    TeamMemberRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class TeamMemberModule { }
