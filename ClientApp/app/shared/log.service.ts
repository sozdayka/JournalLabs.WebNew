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
import { Log } from '../models/Log';


@Injectable()
export class LogService {
  public log:Log = new Log();
  constructor(
    private transferHttp:
      TransferHttp,
    private http: Http,
    @Inject(REQUEST) private baseUrl: string) {

  }

  getLogs(type: string): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/Log/GetLogsByType?type=${type}`);
  }

  writeTeacherLog(data: string,type:string): Observable<any> {
    //return "ok";
    this.log.Text = data;
    this.log.Type = type;
    return this.http.post(`${this.baseUrl}/api/Log/CreateLog`, this.log);
    
    //return this.transferHttp.get(`${this.baseUrl}/api/Group/GetGroups`);
    //return this.transferHttp.get(`${this.baseUrl}/api/Log/WriteTeacherLog?data=` + data);
  }

  writeDevelopmentLog(data: string): Observable<any> {
    
    //return this.transferHttp.get(`${this.baseUrl}/api/Log/WriteDevelopmentLog?data=` + data);
    return this.transferHttp.get(`${this.baseUrl}/api/Log/CreateLog?data=` + data);
  }
}
