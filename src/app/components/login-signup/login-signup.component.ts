import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
  providers: [StudentService, UserService]
})
export class LoginSignupComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  phoneNumberRegex = /^[+]?([0-9]*[\.\s\-\(\)]|[0-9]+){3,24}$/;

  constructor(
    public studentService: StudentService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
    ) { }

  model = {
    student_id :'',
    password:''
  }

  serverErrorMessages!: string;

  ngOnInit(): void {
    this.resetLogInForm();
    this.resetSignUpForm();
    if (this.studentService.isLoggedIn()) {
      this.notificationService.showInfo('You you are already logged in.','Account Status');
      this.router.navigateByUrl('/home');
    }
  }

  //reset Sign Up form (this is the method for the cancel button on the Sign Up form)
  resetSignUpForm(form ?: NgForm) {
    if (form)
      form.reset();

    this.studentService.selectedStudent = {
      _id: '',
      student_id: '',
      first_name: '',
      last_name: '',
      middle_initial: '',
      college: '',
      email: '',
      phone_number: '',
      password: '',
      role: '',
      createdAt : '',
      updatedAt : '',
      account_status: 1
    }
  }

  // reset Login form when cancel button is clicked
  resetLogInForm(form ?: NgForm) {
    if (form)
      form.reset();
    this.model = {
      student_id: "",
      password: ""
    }
  }

  // login student
  onLogin(form : NgForm) {
    this.studentService.login(form.value).subscribe({
      next: (res: any) => {
        this.studentService.setToken(res.token);
        this.router.navigateByUrl('/home');
        this.notificationService.showInfo("Account login success!", "AUP-Online Student Complaint Management System");
      },
      error: (err) => {
        if (err.status === 0) {
          this.serverErrorMessages = 'Server connection failed. Please check your internet connection.'
        } else {
          this.serverErrorMessages = err.error.message;
        }
        //setTimeout(() => this.serverErrorMessages = '', 4000);
        this.notificationService.showError(this.serverErrorMessages, "Authentication Error")
      }
    });
  }

 // sign-up student: create new account
 onSignUp(form : NgForm) {
  this.studentService.postStudent(form.value).subscribe({
    next: (res) => {
      this.resetSignUpForm(form);
      this.router.navigateByUrl('/login');
      this.notificationService.showSuccess("Account registered successfully. You may now login with your account.", "New Student Registration");
    },
    error: (err) => {
      if (err.status === 422) {
        this.serverErrorMessages = err.error.join('<br/>');
      }
      else if (err.status === 0) {
        this.serverErrorMessages = 'Server connection failed. Please check your internet connection.'
      }
      else if (err.status === 500) {
        this.serverErrorMessages = 'Internal server validation error. Please check if your phone number or email are valid.'
      }
      else {
        this.serverErrorMessages = 'Something went wrong. Please contact admin.';
      }
      this.notificationService.showError(this.serverErrorMessages, "Sign up Error")
    }
  });
 }

}

