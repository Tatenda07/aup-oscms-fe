import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, UserAuthGuard } from './auth/auth.guard';
import { RoleGuard, StudentRoleGuard } from './auth/role.guard';

import { AboutComponent } from './components/about/about.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { ComplStatusComponent } from './components/compl-status/compl-status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users.component';
import { ManageComplaintsComponent } from './components/admin/manage-complaints/manage-complaints.component';
import { FaqComponent } from './components/faq/faq.component';
import { HelpComponent } from './components/help/help.component';
import { ManageStudentsComponent } from './components/admin/manage-students/manage-students.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { ResolutionComponent } from './components/resolution/resolution.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginSignupComponent },
  { path: 'about', component: AboutComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard, StudentRoleGuard] },
  { path: 'manage-users', component: ManageUsersComponent, canActivate: [UserAuthGuard, RoleGuard], data: {allowedRoles: ['Admin']} },
  { path: 'manage-concerns', component: ManageComplaintsComponent, canActivate: [UserAuthGuard, RoleGuard], data: {allowedRoles: ['Admin','CSC Personnel']} },
  { path: 'manage-students', component: ManageStudentsComponent, canActivate: [UserAuthGuard, RoleGuard], data: {allowedRoles: ['Admin']} },
  { path: 'my-concerns', component: ComplStatusComponent, canActivate: [AuthGuard, StudentRoleGuard] },
  { path: 'faq', component: FaqComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, StudentRoleGuard] },
  { path: 'help', component: HelpComponent },
  { path: 'submit-concern', component: ComplaintsComponent, canActivate: [AuthGuard, StudentRoleGuard] },
  { path: 'resolutions', component: ResolutionComponent, canActivate: [UserAuthGuard, RoleGuard], data: {allowedRoles: ['Admin', 'SSO Personnel']} },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [UserAuthGuard, RoleGuard], data: {allowedRoles: ['Admin', 'SSO Personnel', 'CSC Personnel']} },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
