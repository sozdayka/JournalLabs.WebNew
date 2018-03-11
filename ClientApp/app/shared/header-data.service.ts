import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class HeaderService {

  private messageSourceTitle = new BehaviorSubject<string>("Добро пожаловать!");
  private messageSourceDes = new BehaviorSubject<string>("Журнал лабораторных работ");
  currentMessageTitle = this.messageSourceTitle.asObservable();
  currentMessageDes = this.messageSourceDes.asObservable();

  constructor() { }

  changeMessage(messageTitle: string,messageDes: string) {
    this.messageSourceTitle.next(messageTitle)
    this.messageSourceDes.next(messageDes)
  }

}