import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //readonly baseURL = 'http://localhost:5000/user';
  readonly baseURL = 'https://aup-oscms.herokuapp.com/user';
  selectedUser: User = {
    _id: '',
    first_name: '',
    last_name: '',
    middle_initial: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: '',
    createdAt : '',
    updatedAt : ''
  };

  usersList!: User[];

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  /* HTTP METHODS */
  //insert new user into the database
  postUser(user: User){
    return this.http.post(this.baseURL, user, this.noAuthHeader);
  }

  //get all users
  getUsers() {
    return this.http.get(this.baseURL, this.noAuthHeader);
  }

  //delete user
  deleteUser(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }

  //edit user in the database (patch method)
  editUser(user : User) {
    return this.http.patch(this.baseURL + `/${user._id}`, user);
  }

  //login user
  login(authCredentials: any) {
    return this.http.post(this.baseURL + '/authenticate', authCredentials);
  }

  //get user profile
  getUserProfile () {
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

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }

  userRole () {
    var userPayload = this.getUserPayload();
    var role = userPayload.role;
    return role;
  }
}
