import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { NotificationService } from '../shared/services/notification.service';

import { StudentService } from '../shared/services/student.service';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (
    private studentService: StudentService,
    private notificationService : NotificationService,
    private router: Router
    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (!this.studentService.isLoggedIn()) {
        this.router.navigateByUrl('/login');
        this.studentService.deleteToken();
        this.notificationService.showError("Login required to access this page","Authentication Error");
        return false;
      }
    return true;
  }

}

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

  constructor (
    private userService: UserService,
    private notificationService : NotificationService,
    private router: Router
    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (!this.userService.isLoggedIn()) {
        this.router.navigateByUrl('/login');
        this.userService.deleteToken();
        this.notificationService.showError("Login required to access this page","Authentication Error");
        return false
      }
    return true;
  }

}
