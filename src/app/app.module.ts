import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { ComplStatusComponent } from './components/compl-status/compl-status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users.component';
import { ManageComplaintsComponent } from './components/admin/manage-complaints/manage-complaints.component';
import { FaqComponent } from './components/faq/faq.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelpComponent } from './components/help/help.component';
import { ManageStudentsComponent } from './components/admin/manage-students/manage-students.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { ResolutionComponent } from './components/resolution/resolution.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AuthGuard } from './auth/auth.guard';
import { UserAuthGuard } from './auth/user-auth.guard';
import { AuthInterceptor, UserAuthInterceptor } from './auth/auth.interceptor';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ChartModule } from 'primeng/chart';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FacebookModule } from 'ngx-facebook';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LoginSignupComponent,
    ComplStatusComponent,
    ProfileComponent,
    HomeComponent,
    ManageUsersComponent,
    ManageComplaintsComponent,
    FaqComponent,
    HelpComponent,
    ManageStudentsComponent,
    ComplaintsComponent,
    ResolutionComponent,
    AdminLoginComponent,
    ErrorPageComponent,
    AnalyticsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FacebookModule.forRoot(),
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ChartModule,
    Ng2SearchPipeModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },{
    provide: HTTP_INTERCEPTORS,
    useClass: UserAuthInterceptor,
    multi: true
  },AuthGuard, UserAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
