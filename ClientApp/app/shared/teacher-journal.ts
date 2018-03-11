import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { User } from '../models/User';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { REQUEST } from './constants/request';
import { AssistantsJournalViewModel } from '../models/assistantsJournalViewModel';
import { TeacherJournal } from '../models/teacherJournal';

@Injectable()
export class TeacherJournalService {
  constructor(
    private transferHttp:
      TransferHttp, 
    private http: Http, 
    @Inject(REQUEST) private baseUrl: string) {

  }

  getAllJournalAssistants(journalId: string): Observable<AssistantsJournalViewModel[]> {
    return this.transferHttp.get(`${this.baseUrl}/api/TeacherJournal/GetAllJournalAssistants?journalId=` + journalId);
  }

  deleteTeacherFromJournal(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/TeacherJournal/DeleteTeacherFromJournal?Id=` + id);
  }

  addTeacherToJournal(teacher: TeacherJournal): Observable<any> {
    //let headers = new Headers();
    //headers.append('Content-Type', 'application/json');
    //headers.append('Accept', 'application/json');
    //let headers = new Headers({ 'Content-Type': 'application/json' });
    //let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.baseUrl}/api/TeacherJournal/AddTeacherToJournal`, teacher);
  }

}
