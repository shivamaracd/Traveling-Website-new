import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { SidebarComponent } from './sidebar/sidebar.component';
// Import other components as needed

const routes: Routes = [
  { path: '', component: BaseComponent },  // Default route for the layout
  { path: 'sidebar', component: SidebarComponent },  // Route for sidebar
  // Add more routes as necessary
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
