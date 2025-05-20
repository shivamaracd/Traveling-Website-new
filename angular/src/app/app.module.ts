import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthenticationModule } from './authentication/auth.module';
// import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
// import { DashboardModule } from './dashboard/dashboard.module';
import { LayoutModule } from './views/layout/layout.module';
import { ClientModule } from './client/client.module';
import { AuthGuard } from './authentication/core/guard/auth.guard';
import { TeamMemberModule } from './team-member/team-member.module';
import { JwtInterceptor } from './authentication/interceptor/interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from "ngx-ui-loader";
import { NgToastModule } from 'ng-angular-popup';
import { DataTablesModule } from 'angular-datatables';
import { CaseListComponent } from './cases/case-list/case-list.component';
import { CaseModule } from './cases/case.module';
import { RouterModule } from '@angular/router';
import { FeatherIconModule } from './core/feather-icon/feather-icon.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // DashboardComponent,
    CaseListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AuthenticationModule,
    // DashboardModule,
    LayoutModule,
    ClientModule,
    TeamMemberModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule,
    NgToastModule,
    DataTablesModule,
    CaseModule,
    FeatherIconModule,
    SharedModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


// providers: [
//   DatePipe,
//   AuthGuard,
//   {
//     provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
//     useValue: {
//       coreLibraryLoader: () => import('highlight.js/lib/core'),
//       languages: {
//         xml: () => import('highlight.js/lib/languages/xml'),
//         typescript: () => import('highlight.js/lib/languages/typescript'),
//         scss: () => import('highlight.js/lib/languages/scss'),
//       }
//     }
//   },
//   { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
//   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
//   AuthService, AuthGuard, ViewService
// ],
