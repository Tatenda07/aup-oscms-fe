import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Complaint } from 'src/app/shared/models/complaint.model';
import { ComplaintService } from 'src/app/shared/services/complaint.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ResolutionService } from 'src/app/shared/services/resolution.service';

@Component({
  selector: 'app-manage-complaints',
  templateUrl: './manage-complaints.component.html',
  styleUrls: ['./manage-complaints.component.css'],
  providers: [ComplaintService, UserService]
})
export class ManageComplaintsComponent implements OnInit {
  viewComplaintsForm = false;
  viewComplaintResolution = false;
  viewResolutionDiv = false;
  specificResolution: any;
  userProfile: any;
  filterTerm!: string;

  constructor(
    public complaintService: ComplaintService,
    private resolutionService: ResolutionService,
    private userService: UserService,
    private notificationService : NotificationService,
    private router: Router
    ) { }

  ngOnInit() {
    this.resetComplaintForm();
    this.refreshComplaintsList();
    this.userService.getUserProfile().subscribe((res: any) => {
      this.userProfile = res['userProfile']
    });
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
      category: "",
      complaint_status: 2,
      moderated_by: undefined,
      FAQ: 0,
      resolution_id: "",
      createdAt: "",
      updatedAt: ""
    }
    this.viewComplaintsForm = false;
    this.refreshComplaintsList();
  }

  // on submit complaint
  onSubmitComplaint(form : NgForm) {
    // atumatically attach moderator username to the complaint
    form.value.moderated_by = this.userProfile.username;
    //update complaint and change the status to moderated
    this.complaintService.moderateComplaint(form.value).subscribe((res) => {
      this.resetComplaintForm(form);
      this.refreshComplaintsList();
      this.notificationService.showSuccess("Concern has been moderated successfully.", "Concerns Management");
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

  // view complaint to be resolved
  viewComplaint(complaint: Complaint) {
    this.complaintService.selectedComplaint = complaint;
  }

  // view resolution
  viewResolution(_id : string) {
    this.resolutionService.getSingleResolution(_id).subscribe((res) => {
      this.specificResolution = res;
    });
    this.viewComplaintResolution = true;
    this.viewResolutionDiv = true;
    this.viewComplaintsForm = false;
  }

  // change status to 'Pending SSO response' when the complaint is sent to the SSO dashboard
  sendToSSO(complaint : Complaint) {
    this.complaintService.sendComplaintToSSO(complaint).subscribe((res) => {
      this.refreshComplaintsList();
      this.notificationService.showInfo("Concern has been sent to SSO dashboard.","Concerns Management");
    })
  }

  //add complaint to FAQ list
  addToFAQ(complaint : Complaint) {
    this.complaintService.addToFAQ(complaint).subscribe(() => {
      this.refreshComplaintsList();
      this.notificationService.showInfo("Concern has been added to FAQ list.","Concerns Management");
    })
  }

  // remove complaint from FAQ list
  removeFromFAQ(complaint : Complaint) {
    this.complaintService.removeFromFAQ(complaint).subscribe(() => {
      this.refreshComplaintsList();
      this.notificationService.showWarning("Concern has been removed to FAQ list.","Concerns Management");
    })
  }

}

