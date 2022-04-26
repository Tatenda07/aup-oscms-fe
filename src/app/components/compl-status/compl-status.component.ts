import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Complaint } from 'src/app/shared/models/complaint.model';
import { ComplaintService } from 'src/app/shared/services/complaint.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { ResolutionService } from 'src/app/shared/services/resolution.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-compl-status',
  templateUrl: './compl-status.component.html',
  styleUrls: ['./compl-status.component.css'],
  providers: [ComplaintService, StudentService, ResolutionService]
})
export class ComplStatusComponent implements OnInit {
  viewComplaintsForm = false;
  viewComplaintResolution = false;
  viewResolutionDiv = false;
  viewComplaintDiv = false;

  myComplaints: any;
  studentProfile: any
  specificResolution: any;

  constructor(
    public complaintService: ComplaintService,
    private notificationService : NotificationService,
    private studentService : StudentService,
    public resolutionService : ResolutionService,
    private router: Router
    ) { }

    ngOnInit() {
      this.studentService.getStudentProfile().subscribe((res: any) => {
        this.studentProfile = res['studentProfile']
      });
      this.resetComplaintForm();
      this.refreshComplaintsList();
    }

    // hide or display complaints form
    toogleDisplayComplaintForm() {
      this.viewComplaintsForm = !this.viewComplaintsForm;
    }

    // get all complaints from the database
    showComplaints() {
      this.complaintService.getComplaint().subscribe((data: any) => this.myComplaints = data);
    }

    // reset complaints form
    resetComplaintForm(form ?: NgForm) {
      if (form)
        form.reset();
      this.complaintService.selectedComplaint = {
        _id: "",
        student_id: "",
        student_name: "",
        complaint_header: "",
        complaint_body: "",
        complaint_status: 0,
        moderated_by: undefined,
        resolution_id: "",
        FAQ: 0,
        createdAt: "",
        updatedAt: ""
      }
      this.viewComplaintsForm = false;
      this.refreshComplaintsList();
    }

    // on submit complaint
    onSubmitComplaint(form : NgForm) {
      //update complaint
      this.complaintService.editComplaint(form.value).subscribe((res) => {
        this.resetComplaintForm(form);
        this.refreshComplaintsList();
        this.notificationService.showSuccess("Concern has been updated successfully", "Concerns Management");
      });

    }

    //on edit complaint
    onEditComplaint(complaint : Complaint) {
      this.complaintService.selectedComplaint = complaint;
      this.viewComplaintsForm = true;
    }

    // refresh complaints list
    refreshComplaintsList() {
      this.complaintService.getComplaint().subscribe((res) => {
        this.complaintService.allComplaints = res as Complaint[];
      });
    }

    // view complaint to be resolved
  viewComplaint(complaint: Complaint) {
    this.complaintService.selectedComplaint = complaint;
    this.viewComplaintResolution = true;
  }

  // view resolution
  viewResolution(_id : string) {
    this.resolutionService.getSingleResolution(_id).subscribe((res) => {
      this.specificResolution = res;
    });
    this.viewComplaintResolution = true;
    this.viewResolutionDiv = true;
  }

    //delete complaint
    onDeleteComplaint(_id : string) {
      if(confirm('Are you sure you want to delete this concern?') == true) {
        this.complaintService.deleteComplaint(_id).subscribe((res) => {
          this.refreshComplaintsList();
          this.viewComplaintResolution = false;
          this.notificationService.showInfo("Concern has been deleted", "Concerns Management");
        });
      }
    }

  }

