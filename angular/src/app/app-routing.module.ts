import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { environment } from 'src/environments/environment';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './authentication/core/guard/auth.guard';



var appuri, logouturi, leadupload, voiceupload, dncupload, profileUpload,
  fileupload, gallerydir, recordingdir, audiopath, audioURL, appurl: string;

if (environment.production) {
  appuri = environment.SERVER;
  logouturi = environment.SERVER + 'logout';
  leadupload = environment.SERVER + 'uploads';
  voiceupload = environment.SERVER + 'uploads';
  profileUpload = environment.SERVER + 'uploads';
  dncupload = environment.SERVER + 'dnc';
  fileupload = environment.SERVER + 'fileupload';
  appurl = environment.SERVERURL;
  gallerydir = environment.SERVERURL + "voicemail/";
  recordingdir = environment.RECORDRURL;
}
else {
  appuri = environment.SERVER;
  logouturi = environment.SERVER + 'logout';
  leadupload = environment.SERVER + 'uploads';
  voiceupload = environment.SERVER + 'uploads';
  profileUpload = environment.SERVER + 'uploads';
  dncupload = environment.SERVER + 'dnc';
  fileupload = environment.SERVER + 'fileupload';
  appurl = environment.SERVERURL;
  gallerydir = environment.SERVERURL + "voicemail/";
  recordingdir = environment.RECORDRURL;
}


export const CIAPIURL = 'http://localhost:4228/'
export const APIURL = appuri;
export const LogoutURL = logouturi;
export const LeadsUpload = leadupload;
export const VoiceUpload = voiceupload;
export const ProfileUpload = profileUpload;
export const DncUpload = dncupload;
export const FileUpload = fileupload;
export const AUDIOURL = appurl;
export const RecordingUrl = recordingdir;
export const GalleryPath = gallerydir;
export const AudioPath = audiopath
export const didupload = environment.SERVER + "didupload"
export const uploadcontact = environment.SERVER + "uploadcontact"
export const particulerUploadcontact = environment.SERVER + "particulerUploadcontact"
export const uploadblacklist = environment.SERVER + "uploadblacklist"
export const uploadDtmf = environment.SERVER + "uploadDtmf"
export const audioupload = environment.SERVER + "audioupload"
export const imgupload = environment.SERVER + "imgupload"
export const uploadsounds = environment.SERVER + "uploadsounds"
// export const audiovPath = environment.audioURL
export const uploadDid = environment.SERVER + "uploadDid";
export const companyDoc = environment.SERVER + "companyDoc";
// export const recordingUrl = environment.recURL;
// export const urlLogo = environment.logoURL;


// const routes: Routes = [
//   { path: '', component: LoginComponent }, // Default route to login
//   { path: '**', redirectTo: '' } // Fallback for unknown routes
// ];



const routes: Routes = [
  {
    path: 'auth', loadChildren: () => import('./authentication/auth.module').then(m => m.AuthenticationModule)
  },
  {
    path:'',loadChildren:()=> import('./authentication/auth.module').then(m => m.AuthenticationModule)
  },
  {
    path: '',
    component: BaseComponent,
    canActivate:[AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'vander',
        loadChildren: () => import('./vander/vander.module').then(m => m.VanderModule)
      },
      {
        path: 'client',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
      },
      {
        path: 'shipment',
        loadChildren: () => import('./shipment/shipment.module').then(m => m.ShipmentModule)
      },
      {
        path: 'branch',
        loadChildren: () => import('./branch/branch-routing.module').then(m => m.BranchRoutingModule)
      },
      {
        path: 'manifest',
        loadChildren: () => import('./manifest/manifest.module').then(m => m.ManifestModule)
      },
      {
        path: 'delivery',
        loadChildren: () => import('./delivery/delivery.module').then(m => m.DeliveryModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
      },
      {
        path: 'team',
        loadChildren: () => import('./team-member/team-member.module').then(m => m.TeamMemberModule)
      },
      {
        path: 'task',
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule)
      },
      // {
      //   path: 'act',
      //   loadChildren: () => import('./act/act.module').then(m => m.ActModule)
      // },
      {
        path: 'notes',
        loadChildren: () => import('./notes/notes.module').then(m => m.NotesModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)
      },
      {
       path: 'profile',
       loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
