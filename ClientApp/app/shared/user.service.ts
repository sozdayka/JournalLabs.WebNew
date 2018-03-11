import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { User } from '../models/User';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { REQUEST } from './constants/request';
import { AssistantsJournalViewModel } from '../models/assistantsJournalViewModel';

@Injectable()
export class UserService {
  constructor(
    private transferHttp:
    TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
    private http: Http, // Use for everything else
    @Inject(REQUEST) private baseUrl: string) {

  }

  getUsers(): Observable<User[]> {
    // ** TransferHttp example / concept **
    //    - Here we make an Http call on the server, save the result on the window object and pass it down with the SSR,
    //      The Client then re-uses this Http result instead of hitting the server again!

    //  NOTE : transferHttp also automatically does .map(res => res.json()) for you, so no need for these calls
    return this.transferHttp.get(`${this.baseUrl}/api/User/GetUsers`);
  }

  getUser(id: string): Observable<User> {
    return this.transferHttp.get(`${this.baseUrl}/api/User/GetUserById` + id);
  }
  getAllAssistants(): Observable<User[]> {
    return this.transferHttp.get(`${this.baseUrl}/api/User/GetAllAssistants`);
  }
  
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/User/DeleteUserById` + id);
  }

  signInUser(user: User): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.baseUrl}/api/User/SignInUser`, user, options);
  }

  addUser(user: User): Observable<any> {
    //let headers = new Headers();
    //headers.append('Content-Type', 'application/json');
    //headers.append('Accept', 'application/json');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.baseUrl}/api/User/CreateUser`, user, options);
  }

}
