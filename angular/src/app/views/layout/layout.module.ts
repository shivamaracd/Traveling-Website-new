import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from './base/base.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LayoutRoutingModule } from './layout-routing.module';
import { FeatherIconModule } from '../../core/feather-icon/feather-icon.module';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// import { ContentAnimateDirective } from '../../core/content-animate/content-animate.directive';

// import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// import { FeatherIconModule } from '../../core/feather-icon/feather-icon.module';

// import { AppsModule } from '../pages/apps/apps.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    BaseComponent, 
    NavbarComponent, 
    SidebarComponent, 
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    // AppsModule,
    FeatherIconModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    BaseComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
