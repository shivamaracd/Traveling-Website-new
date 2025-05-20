import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMemberRoutingModule } from './team-member-routing.module';
import { MemberComponent } from './member/member.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddMemberComponent } from './add-member/add-member.component';
import { NgToastModule } from 'ng-angular-popup';
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
    NgToastModule,
    NgMultiSelectDropDownModule,
    NgbModule
  ]
})
export class TeamMemberModule { }
