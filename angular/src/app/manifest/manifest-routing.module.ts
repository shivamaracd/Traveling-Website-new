import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManifestComponent } from './manifest/manifest.component';
import { AddManifestComponent } from './add-manifest/add-manifest.component';

const routes: Routes = [
   {path : '', component:ManifestComponent},
    {path:'manifest', component:ManifestComponent},
    {path : 'add', component:AddManifestComponent},
    {path : 'edit/:id', component:AddManifestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManifestRoutingModule { }
