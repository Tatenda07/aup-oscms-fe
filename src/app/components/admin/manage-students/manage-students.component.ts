import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Student } from 'src/app/shared/models/student.model';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.css'],
  providers: [StudentService]
})
export class ManageStudentsComponent implements OnInit {
  showHideStudentsForm = false;
  students: any;
  studentDetails: any;
  serverErrorMessages!: string;

  constructor(
    private router: Router,
    public studentService: StudentService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.resetStudentsForm();
    this.refreshStudentsList();
  }

  toggleDisplayDivIf() {
    this.showHideStudentsForm = !this.showHideStudentsForm;
  }

  //reset students form (this is the method for the cancel button on the form)
  resetStudentsForm(form ?: NgForm) {
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

    this.showHideStudentsForm = true;
    this.refreshStudentsList();
  }

  //edit or update student info
  onEditStudent(student : Student) {
    this.studentService.selectedStudent = student;
    this.showHideStudentsForm = false;
  }

  //refresh students list
  refreshStudentsList() {
    this.studentService.getStudents().subscribe((res) => {
      this.studentService.allStudents = res as Student[];
    });
  }

  onSubmitStudent(form : NgForm) {
    //add new student
    if (form.value._id == "") {
      this.studentService.postStudent(form.value).subscribe({
        next: (res) => {
          this.resetStudentsForm(form);
          this.refreshStudentsList();
          this.notificationService.showSuccess("New student registered successfully.", "Student Management");
        },
        error: (err) => {
          if (err.status === 0) {
            this.serverErrorMessages = 'Server connection failed. Please check your internet connection.'
          } else {
            this.serverErrorMessages = err.error.message;
          }
          this.notificationService.showError(this.serverErrorMessages, "Student Management Error")
        }
      });

    //update existing student
    } else {
      this.studentService.editStudent(form.value).subscribe((res) => {
        this.resetStudentsForm(form);
        this.refreshStudentsList();
        this.notificationService.showSuccess("Student details has been updated successfully.", "Student Management");
      });
    }
  }

  //delete student
  onDeleteStudent(_id: string){
    if(confirm('Are you sure you want to delete this student account?') == true) {
      this.studentService.deleteStudent(_id).subscribe((res) => {
        this.refreshStudentsList();
        this.notificationService.showInfo("Student account has been deleted.", "Student Management");
      });
    }
  }

}
