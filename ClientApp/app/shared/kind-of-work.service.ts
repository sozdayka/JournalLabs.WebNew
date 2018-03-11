import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { KindOfWork } from '../models/kind-of-work';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { REQUEST } from './constants/request';

@Injectable()
export class KindOfWorkService {
  constructor(
    private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
    private http: Http, // Use for everything else
    @Inject(REQUEST) private baseUrl: string) {

  }

  getKindOfWorks(): Observable<any> {
    // ** TransferHttp example / concept **
    //    - Here we make an Http call on the server, save the result on the window object and pass it down with the SSR,
    //      The Client then re-uses this Http result instead of hitting the server again!

    //  NOTE : transferHttp also automatically does .map(res => res.json()) for you, so no need for these calls
    return this.transferHttp.get(`${this.baseUrl}/api/KindOfWork/GetKindOfWorks`);
  }

  getKindOfWork(id: string): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/KindOfWork/GetKindOfWorkById` + id);
  }

  deleteKindOfWork(id: string): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/KindOfWork/DeleteKindOfWorkById?Id=` + id);
  }

  updateKindOfWork(kindOfWork: KindOfWork): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/KindOfWork/UpdateKindOfWork`, kindOfWork);
  }

  addKindOfWork(kindOfWork: KindOfWork): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/KindOfWork/CreateKindOfWork`, kindOfWork)
  }

  updateVisibleKindOfWork(idKindOfWork: string, isVisible: boolean): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/KindOfWork/UpdateVisibleKindOfWork?idKindOfWork=${idKindOfWork}&isKindOfWorkVisible=${isVisible}`);
  }
  updateVisibleKindOfWorkForStudent(idKindOfWork: string, isVisible: boolean): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/KindOfWork/UpdateVisibleKindOfWorkForStudent?idKindOfWork=${idKindOfWork}&isKindOfWorkVisibleForStudent=${isVisible}`);
  }
}
