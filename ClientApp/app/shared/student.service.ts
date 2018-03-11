import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { Student } from '../models/Student';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { REQUEST } from './constants/request';

@Injectable()
export class StudentService {
  constructor(
    private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
    private http: Http, // Use for everything else
    @Inject(REQUEST) private baseUrl: string) {

  }

  getStudents(): Observable<any> {
    // ** TransferHttp example / concept **
    //    - Here we make an Http call on the server, save the result on the window object and pass it down with the SSR,
    //      The Client then re-uses this Http result instead of hitting the server again!

    //  NOTE : transferHttp also automatically does .map(res => res.json()) for you, so no need for these calls
    return this.transferHttp.get(`${this.baseUrl}/api/Student/GetStudents`);
  }

  getStudent(id: string): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/Student/GetStudentById` + id);
  }
  getStudentsByGroupId(groupId: string): Observable<Student[]> {
    return this.transferHttp.get(`${this.baseUrl}/api/Student/GetStudentsByGroupId?groupId=${groupId}` );
  }
  
  deleteStudent(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Student/DeleteStudentById?Id=${id}`);
  }

  updateStudent(student: Student): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Student/UpdateStudent`, student);
  }

  addStudent(student: Student): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Student/CreateStudent`, student)
  }
}
