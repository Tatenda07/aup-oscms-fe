import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Complaint } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  readonly baseURL = 'http://localhost:5000/complaint';
  //readonly baseURL = 'https://aup-oscms.herokuapp.com/complaint';
  selectedComplaint!: Complaint;

  allComplaints!: Complaint[];

  singleStudentComplaints!: Complaint[];

  constructor(private http: HttpClient) { }

  //add new complaint
  postComplaint(complaint : Complaint) {
    return this.http.post(this.baseURL, complaint);
  }

  //get all complaints
  getComplaint() {
    return this.http.get(this.baseURL);
  }

  //get all complaints from a specific student
  getStudentComplaints(student_id: string) {
    return this.http.get(this.baseURL + `/studentComplaints/${student_id}`);
  }

  //get resolved complaints
  getResolvedComplaints() {
    return this.http.get(this.baseURL + `/resolved`);
  }

  //get pending SSO response complaints
  getPendingSSOResponse() {
    return this.http.get(this.baseURL + `/pending`);
  }

  //get moderated complaints
  getModeratedComplaints() {
    return this.http.get(this.baseURL + `/moderated`);
  }

  //get in queue complaints
  getInQueueComplaints() {
    return this.http.get(this.baseURL + `/inQueue`);
  }

  //delete complaint
  deleteComplaint(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }

  //edit complaint (for students)
  editComplaint(complaint : Complaint) {
    return this.http.patch(this.baseURL + `/${complaint._id}`, complaint);
  }

  //get single complaint
  getSingleComplaint(_id: string) {
    return this.http.get(this.baseURL + `/${_id}`)
  }

  //moderate complaint
  moderateComplaint(complaint : Complaint) {
    // change complaint status to 'Moderated'
    complaint.complaint_status = 2;
    return this.http.patch(this.baseURL + `/${complaint._id}`, complaint);
  }

  // send complaint to SSO dashboard
  sendComplaintToSSO(complaint : Complaint) {
    // change complaint status to 'Pending SSO response'
    complaint.complaint_status = 3;
    return this.http.patch(this.baseURL + `/${complaint._id}`, complaint);
  }

  // add complaint to FAQ list
  addToFAQ(complaint : Complaint) {
    complaint.FAQ = 1;
    return this.http.patch(this.baseURL + `/${complaint._id}`, complaint);
  }

  // remove complaint from FAQ list
  removeFromFAQ(complaint : Complaint) {
    complaint.FAQ = 0;
    return this.http.patch(this.baseURL + `/${complaint._id}`, complaint);
  }
}
