import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { LabBlock } from '../models/LabBlock';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { REQUEST } from './constants/request';

@Injectable()
export class LabBlockService {
  constructor(
    private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
    private http: Http, // Use for everything else
    @Inject(REQUEST) private baseUrl: string) {

  }

  getLabBlocks(): Observable<any> {
    // ** TransferHttp example / concept **
    //    - Here we make an Http call on the server, save the result on the window object and pass it down with the SSR,
    //      The Client then re-uses this Http result instead of hitting the server again!

    //  NOTE : transferHttp also automatically does .map(res => res.json()) for you, so no need for these calls
    return this.transferHttp.get(`${this.baseUrl}/api/LabBlock/GetLabBlocks`);
  }

  getLabBlock(id: string): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/LabBlock/GetLabBlockById` + id);
  }

  deleteLabBlock(id: string): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/LabBlock/DeleteLabBlockById?Id=` + id);
  }

  updateLabBlock(labBlock: LabBlock): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/LabBlock/UpdateLabBlock`, labBlock);
  }

  addLabBlock(labBlock: LabBlock): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/LabBlock/CreateLabBlock`, labBlock)
  }
  deleteLabBlockByStudentId(studentId: string): Observable<any> {
    return this.transferHttp.get(`${this.baseUrl}/api/LabBlock/DeleteLabBlockByStudentId?studentId=` + studentId);
  }
}
