import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Resolution } from '../models/resolution.model';

@Injectable({
  providedIn: 'root'
})
export class ResolutionService {
  //readonly baseURL = 'http://localhost:5000/resolution';
  readonly baseURL = 'https://aup-oscms.herokuapp.com/resolution';
  selectedResolution!: Resolution;

  allResolutions!: Resolution[];

  constructor(private http: HttpClient) { }

  //add new resolution
  postResolution(resolution : Resolution) {
    return this.http.post(this.baseURL, resolution);
  }

  //get all resolutions
  getResolution() {
    return this.http.get(this.baseURL);
  }

  //get single resolution
  getSingleResolution(_id: string) {
    return this.http.get(this.baseURL + `/${_id}`);
  }

  //delete resolution
  deleteResolution(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }

  //edit resolution
  editResolution(resolution : Resolution) {
    return this.http.patch(this.baseURL + `/${resolution._id}`, resolution);
  }
}
