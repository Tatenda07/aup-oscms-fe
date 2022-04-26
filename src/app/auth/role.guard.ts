import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { StudentService } from '../shared/services/student.service';
import { NotificationService } from '../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private notificationService: NotificationService ,private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route);
  }

  private isAuthorized(route: ActivatedRouteSnapshot) : boolean {
    const role: any[] = [];
    role.push(this.userService.userRole());
    const allowedRoles = route.data['allowedRoles'];
    const roleMatches = role.findIndex((role: any) => allowedRoles.indexOf(role) !== -1);
    if (roleMatches < 0) {
      this.notificationService.showError("You are not authorized to access this page.", "Authorization Error")
      return false
    }
    return true
  }

}

@Injectable({
  providedIn: 'root'
})
export class StudentRoleGuard implements CanActivate {

  constructor(private studentService: StudentService, private notificationService: NotificationService ,private router: Router) {}

  canActivate() {
    const role = this.studentService.roleStudent();
    if (role === 'Student') {
      return true;
    }
    this.notificationService.showError("Only students can access this page.", "Authorization Error")
    return false
  }

}

