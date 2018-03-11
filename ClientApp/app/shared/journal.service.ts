import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { Journal } from '../models/Journal';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { REQUEST } from './constants/request';
import { CreateJournalViewModel } from "../models/createJournalViewModel";
import { AddStudentToJournalViewModel } from "../models/addStudentToJournalViewModel";

@Injectable()
export class JournalService {
  constructor(
    private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
    private http: Http, // Use for everything else
    @Inject(REQUEST) private baseUrl: string) {

  }

  getJournals(): Observable<any> {
    // ** TransferHttp example / concept **
    //    - Here we make an Http call on the server, save the result on the window object and pass it down with the SSR,
    //      The Client then re-uses this Http result instead of hitting the server again!

    //  NOTE : transferHttp also automatically does .map(res => res.json()) for you, so no need for these calls
    return this.transferHttp.get(`${this.baseUrl}/api/Journal/GetJournals`);
  }

  getJournal(id: string): Observable<any> {
    var isTeacher = localStorage.getItem('Role') == 'Teacher';
    return this.transferHttp.get(`${this.baseUrl}/api/Journal/GetJournalById?Id=${id}&isTeacher=${isTeacher}`);
  }

  deleteJournal(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/Journal/DeleteJournalById` + id);
  }

  updateJournal(journal: Journal): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Journal/UpdateJournal`, journal);
  }

  addJournal(createJournalViewModel: CreateJournalViewModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Journal/CreateJournal`, createJournalViewModel);
  }
  getAllJournalsByTeacherId(teacherId: string, role:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Journal/GetAllJournalsByTeacherId?teacherId=${teacherId}&role=${role}`);
  }
  getJournalByIdAndStudentId(journalId: string, studentId: string): Observable<any> {
    var isTeacher = localStorage.getItem('Role') == 'Teacher';
    return this.http.get(`${this.baseUrl}/api/Journal/GetJournalByIdAndStudentId?journalId=${journalId}&studentId=${studentId}&isTeacher=${isTeacher}`);
  }
  getAllStudentJournalsByStudentName(studentName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Journal/GetAllStudentJournalsByStudentName?studentName=${studentName}`);
  }
  addStudentToJournal(addStudentToJournalViewModel: AddStudentToJournalViewModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Journal/AddStudentToJournal`, addStudentToJournalViewModel);
  }
  addKindOfWorkToJournal(journalId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Journal/AddKindOfWorkToJournal?journalId=${journalId}`);
  }
}
