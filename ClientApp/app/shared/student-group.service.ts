import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { Group } from '../models/Group';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { REQUEST } from './constants/request';
import { StudentGroup } from '../models/studentGroup';
import { AddStudentToGroup } from '../models/addStudentToGroup';

@Injectable()
export class StudentGroupService {
  constructor(
    private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
    private http: Http, // Use for everything else
    @Inject(REQUEST) private baseUrl: string) {

  }

  //getGroups(): Observable<any> {
  //  // ** TransferHttp example / concept **
  //  //    - Here we make an Http call on the server, save the result on the window object and pass it down with the SSR,
  //  //      The Client then re-uses this Http result instead of hitting the server again!

  //  //  NOTE : transferHttp also automatically does .map(res => res.json()) for you, so no need for these calls
  //  return this.transferHttp.get(`${this.baseUrl}/api/Group/GetGroups`);
  //}

  getStudentGroup(id: string): Observable<StudentGroup> {
    return this.transferHttp.get(`${this.baseUrl}/api/StudentGroup/GetStudentGroupById?Id=${id}`);
  }

  deleteStudentGroup(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/StudentGroup/DeleteStudentGroupById?Id=${id}`);
  }

  updateStudentGroup(studentGroup: StudentGroup): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/StudentGroup/UpdateStudentGroup`, studentGroup);
  }

  addStudentGroup(studentGroup: StudentGroup): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/StudentGroup/CreateStudentGroup`, studentGroup)
  }
  addStudentToGroup(addStudentToGroup: AddStudentToGroup): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/StudentGroup/AddStudentToGroup`, addStudentToGroup)
  }
}
