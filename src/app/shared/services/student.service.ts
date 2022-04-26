
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Student } from '../models/student.model'

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  //readonly baseURL = 'http://localhost:5000/student';
  readonly baseURL = 'https://aup-oscms.herokuapp.com/student';
  selectedStudent!: Student;

  allStudents!: Student[];

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  /* HTTP METHODS */
  //insert new student into the database
  postStudent(student: Student){
    return this.http.post(this.baseURL, student, this.noAuthHeader);
  }

  //get all students
  getStudents() {
    return this.http.get(this.baseURL, this.noAuthHeader);
  }

  //delete student
  deleteStudent(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`, this.noAuthHeader);
  }

  //edit student infrmation in the database (patch method)
  editStudent(student : Student) {
    return this.http.patch(this.baseURL + `/${student._id}`, student, this.noAuthHeader);
  }

  //login student
  login(authCredentials: any) {
    return this.http.post(this.baseURL + '/authenticate', authCredentials, this.noAuthHeader);
  }

  //get student profile
  getStudentProfile () {
    return this.http.get(this.baseURL + '/profile')
  }

  /* HELPER METHODS */
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getStudentPayload() {
    var token = this.getToken();
    if (token) {
      var studentPayload = atob(token.split('.')[1]);
      return JSON.parse(studentPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var studentPayload = this.getStudentPayload();
    if (studentPayload)
      return studentPayload.exp > Date.now() / 1000;
    else
      return false;
  }

  roleStudent () {
    var studentPayload = this.getStudentPayload();
    var role = studentPayload.role;
    return role;
  }
}
