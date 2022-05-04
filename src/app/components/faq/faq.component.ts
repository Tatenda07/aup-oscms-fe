import { Component, OnInit } from '@angular/core';
import { Complaint } from 'src/app/shared/models/complaint.model';
import { ComplaintService } from 'src/app/shared/services/complaint.service';
import { ResolutionService } from 'src/app/shared/services/resolution.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  specificResolution: any;
  viewResolutionParagraph = false;
  filterTerm!: string;

  constructor(
    public complaintService: ComplaintService,
    private resolutionService: ResolutionService
  ) { }

  ngOnInit(): void {
    this.refreshComplaintsList();
  }

  closeResolutionParagraph() {
    this.viewResolutionParagraph = false;
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
  }

  // view resolution
  viewResolution(_id : string) {
    this.resolutionService.getSingleResolution(_id).subscribe((res) => {
      this.specificResolution = res;
      this.viewResolutionParagraph = true;
    });
  }

}

