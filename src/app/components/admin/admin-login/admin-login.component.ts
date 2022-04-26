import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  providers: [UserService]
})
export class AdminLoginComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  phoneNumberRegex = /^[+]?([0-9]*[\.\s\-\(\)]|[0-9]+){3,24}$/;

  constructor(
    public userService: UserService,
    private studentService: StudentService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  model = {
    email :'',
    password:''
  }

  serverErrorMessages!: string;

  ngOnInit(): void {
    this.resetLogInForm();
    if (this.userService.isLoggedIn() && this.userService.userRole() === 'Admin') {
      this.notificationService.showInfo('You you are already logged in.','Account Status');
      this.router.navigateByUrl('/manage-users');
    }
    if (this.userService.isLoggedIn() && this.userService.userRole() === 'SSO Personnel') {
      this.notificationService.showInfo('You you are already logged in.','Account Status');
      this.router.navigateByUrl('/resolutions');
    }
    if (this.userService.isLoggedIn() && this.userService.userRole() === 'CSC Personnel') {
      this.notificationService.showInfo('You you are already logged in.','Account Status');
      this.router.navigateByUrl('/manage-concerns');
    }
  }

  // reset Login form when cancel button is clicked
  resetLogInForm(form ?: NgForm) {
    if (form)
      form.reset();
    this.model = {
      email: "",
      password: ""
    }
  }

  // login student
  onLogin(form : NgForm) {
    this.userService.login(form.value).subscribe({
      next: (res: any) => {
        this.userService.setToken(res.token);
        // admin dashboard
        if (this.userService.userRole() === 'Admin')
          this.router.navigateByUrl('/manage-users');
        // SSO dashboard
        if (this.userService.userRole() === 'SSO Personnel')
          this.router.navigateByUrl('/resolutions');
        // CSC dashboard
        if (this.userService.userRole() === 'CSC Personnel')
          this.router.navigateByUrl('/manage-concerns');
        this.notificationService.showInfo("Account login success!", "AUP-Online Student Concern Management System");
      },
      error: (err) => {
        if (err.status === 0) {
          this.serverErrorMessages = 'Server connection failed. Please check your internet connection.'
        } else {
          this.serverErrorMessages = err.error.message;
        }
        this.notificationService.showError(this.serverErrorMessages, "Authentication Error")
      }
    });
  }

}

