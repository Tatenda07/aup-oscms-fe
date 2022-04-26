import { Component, OnInit } from '@angular/core';
import { ComplaintService } from 'src/app/shared/services/complaint.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  inQueueConcerns: number = 0;
  moderatedConcerns: number = 0;
  pendingSSOResponse: number = 0;
  resolvedConcerns: number = 0;
  chartData: any;
  dataSet = new Array<number>(4);

  constructor(private complaintService: ComplaintService) { }

  ngOnInit(): void {
    this.getResolvedComplaints();
    this.getPendingSSOResponse();
    this.getModeratedComplaints();
    this.getInQueuComplaints();
    setTimeout(() => {
      this.chartData = {
        labels: ['In Queue Concerns', 'Moderated Concerns', 'Pending SSO Response', 'Resolved Concerns'],
        datasets: [
          {
            data: this.dataSet,
            backgroundColor: ['#949FB1', '#4D5360', '#FDB45C', '#46BFBD'],
            hoverBackgroundColor: ['#A8B3C5', '#616774', '#FFC870','#5AD3D1'],
            borderWidth: 2
          }
        ]
      };
    }, 3000);
  }

  // get total number of complaints with status: resolved
  getResolvedComplaints() {
    this.complaintService.getResolvedComplaints().subscribe((data: any) => {
      this.resolvedConcerns = data.length
      // return 0 if data is undefined
      if (data.length === undefined)
        this.resolvedConcerns = 0;
      this.dataSet[3] = this.resolvedConcerns;
    });
  }

  // get total number of complaits with status: pending SSO response
  getPendingSSOResponse() {
    this.complaintService.getPendingSSOResponse().subscribe((data: any) => {
      this.pendingSSOResponse = data.length
      // return 0 if data is undefined
      if (data.length === undefined)
        this.pendingSSOResponse = 0;
      this.dataSet[2] = this.pendingSSOResponse;
    });
  }

  // get total number of complaits with status: moderated
  getModeratedComplaints() {
    this.complaintService.getModeratedComplaints().subscribe((data: any) => {
      this.moderatedConcerns = data.length;
      // return 0 if data is undefined
      if (data.length === undefined)
        this.moderatedConcerns = 0;
      this.dataSet[1] = this.moderatedConcerns;
    });
  }

  // get total number of complaits with status: in queue
  getInQueuComplaints() {
    this.complaintService.getInQueueComplaints().subscribe((data: any) => {
      this.inQueueConcerns = data.length
      // return 0 if data is undefined
      if (data.length === undefined)
        this.inQueueConcerns = 0;
      this.dataSet[0] = this.inQueueConcerns;
    });
  }

  options: any = {
    responsive: true
  }

  chartClicked(event: any): void {
    console.log(event);
  }

  chartHovered(event: any): void {
    console.log(event);
  }

}
