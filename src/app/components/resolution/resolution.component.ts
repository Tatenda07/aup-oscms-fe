import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Resolution } from 'src/app/shared/models/resolution.model';
import { Complaint } from 'src/app/shared/models/complaint.model';
import { ResolutionService } from 'src/app/shared/services/resolution.service';
import { ComplaintService } from 'src/app/shared/services/complaint.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-resolution',
  templateUrl: './resolution.component.html',
  styleUrls: ['./resolution.component.css'],
  providers: [ResolutionService]
})
export class ResolutionComponent implements OnInit {
  viewResolutionForm = false;
  viewComplaintResolution = false;
  viewResolutionComplaint = false;
  resolutions: any;
  specificResolution: any;
  specificComplaint: any;
  userProfile: any;
  filterConcerns!: string;
  filterResolutions!: string;

  constructor(
    public resolutionService: ResolutionService,
    public complaintService: ComplaintService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.resetResolutionForm();
    this.refreshResolutionsList();
    this.refreshComplaintsList();
    this.userService.getUserProfile().subscribe((res: any) => {
      this.userProfile = res['userProfile']
    })
  }

  // get all resolutions from the database
  showResolutions() {
    this.resolutionService.getResolution().subscribe((data: any) => this.resolutions = data);
    console.log(this.resolutions);
  }

  // reset resolutions form
  resetResolutionForm(form ?: NgForm) {
    if (form)
      form.reset();
    this.resolutionService.selectedResolution = {
      _id: "",
      complaint_id: "",
      user_id: "",
      resolution_header: "",
      resolution_body: "",
      respondent_username: "",
      updated_by: undefined,
      createdAt: "",
      updatedAt: ""
    }
    this.viewResolutionForm = false;
    this.refreshResolutionsList();
  }

  // on submit resolution
  onSubmitResolution(form : NgForm) {
    // add new resolution
    if (form.value._id === ""){
      form.value.complaint_id = this.complaintService.selectedComplaint._id;
      form.value.user_id = this.userProfile._id;
      form.value.respondent_username = this.userProfile.username;
      this.resolutionService.postResolution(form.value).subscribe((res) => {
        this.resetResolutionForm(form);
        this.refreshResolutionsList();
        this.refreshComplaintsList();
        this.viewComplaintResolution = false;
        this.notificationService.showSuccess("New Resolution added successfully", "Resolutions Management");
      });
    // update existing resolution
    } else {
      form.value.updated_by = this.userProfile.username;
      this.resolutionService.editResolution(form.value).subscribe((res) => {
        this.resetResolutionForm(form);
        this.refreshResolutionsList();
        this.refreshComplaintsList();
        this.viewComplaintResolution = false;
        this.notificationService.showSuccess("Resolution has been updated successfully", "Resolutions Management");
      });
    }
  }

  //on edit resolution
  onEditResolution(resolution : Resolution) {
    this.resolutionService.selectedResolution = resolution;
    this.viewResolutionForm = true;
  }

  // refresh resolutions list
  refreshResolutionsList() {
    this.resolutionService.getResolution().subscribe((res) => {
      this.resolutionService.allResolutions = res as Resolution[];
    });
  }

  // view complaint to be resolved
  viewComplaint(complaint: Complaint) {
    this.complaintService.selectedComplaint = complaint;
  }

  // view resolution
  viewResolution(resolution : Resolution) {
    this.resolutionService.selectedResolution = resolution;
  }

  // view specific resolution
  viewSpecificResolution(_id : string) {
    this.resolutionService.getSingleResolution(_id).subscribe((res) => {
      this.specificResolution = res;
    });
    this.viewComplaintResolution = true;
    this.viewResolutionComplaint = false;
    this.viewResolutionForm = false;
  }

  // view specific complaint (resolved already)
  viewSpecificComplaint(_id : string) {
    this.complaintService.getSingleComplaint(_id).subscribe((res) => {
    this.specificComplaint = res;
    });
    this.viewComplaintResolution = false;
    this.viewResolutionComplaint = true;
    this.viewResolutionForm = false;
  }

  // refresh complaints list
  refreshComplaintsList() {
    this.complaintService.getComplaint().subscribe((res) => {
      this.complaintService.allComplaints = res as Complaint[];
    });
  }

  //delete resolution
  onDeleteResolution(_id : string) {
    if(confirm('Are you sure you want to delete this resolution?') == true) {
      this.resolutionService.deleteResolution(_id).subscribe((res) => {
        this.refreshResolutionsList();
        this.refreshComplaintsList();
        this.viewComplaintResolution = false;
        this.notificationService.showInfo("Resolution has been deleted", "Resolutions Management");
      });
    }
  }

}

