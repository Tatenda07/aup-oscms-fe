import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StudentService } from '../shared/services/student.service';
import { UserService } from '../shared/services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor (private studentService: StudentService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.headers.get('noauth'))
      return next.handle(req.clone());
    else {
      const clonedreq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + this.studentService.getToken())
      });
      return next.handle(clonedreq).pipe(
        tap({
          next: (event) => {},
          error: (err) => {
            if (err.error.auth === false) {
              this.router.navigateByUrl('/login');
            }
          }
        })
      );
    }
  }
}

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {

  constructor (private userService: UserService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.headers.get('noauth'))
      return next.handle(req.clone());
    else {
      const clonedreq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + this.userService.getToken())
      });
      return next.handle(clonedreq).pipe(
        tap({
          next: (event) => {},
          error: (err) => {
            if (err.error.auth === false) {
              this.router.navigateByUrl('/login');
            }
          }
        })
      );
    }
  }
}
