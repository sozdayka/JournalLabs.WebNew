import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { Journal } from '../models/Journal';
import { StudentJournal } from '../models/studentJournal';
import { LogService } from './log.service';


@Injectable()
export class SearchDataService {

  public studentJournals: StudentJournal[] = [];
  public studentName:string="";

  private messageStudentJournals = new BehaviorSubject<StudentJournal[]>(this.studentJournals);
  currentMessageStudentJournals = this.messageStudentJournals.asObservable();

  constructor() { }

  changeMessage(message: StudentJournal[]) {
    this.messageStudentJournals.next(message)
  }

}