import { Component,OnInit } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from '../../shared/user.service';
import { NgModel } from '@angular/forms';
import { LogService } from '../../shared/log.service';
import { CathedraService } from '../../shared/cathedra.service';
import { Cathedra } from '../../models/Cathedra';

import { HeaderService } from '../../shared/header-data.service';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  messageTitle:string;
  messageDes:string;

  public teacherModel: User = { Id: "", Login: "", Password: "111111", Role: "Teacher", CathedraId:"" };
  public cathedrasList: Cathedra[] = [];
  constructor(private data: HeaderService,private userService: UserService,
    private logService: LogService,
    private cathedraService: CathedraService) { }
  ngOnInit() {
    this.loadCathedras();
    this.data.currentMessageTitle.subscribe(messageTitle => this.messageTitle = messageTitle,messageDes => this.messageDes = messageDes)
    this.data.changeMessage("Добавление нового пользователя","Работа с пользователями")

  }

  public loadCathedras() {
    this.cathedraService.getCathedras().subscribe(response => {
      this.cathedrasList = response;
      this.teacherModel.CathedraId = this.cathedrasList[0].Id;
    });
  }
    public SignUp() {      
      //this.teacherModel.Role = "Teacher";
      debugger;
      this.userService.addUser(this.teacherModel).subscribe(response => {
        var logText = `${new Date().toLocaleString()} Преподаватель ${this.teacherModel.Login} успешно добавлен`;
        this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
          alert("Преподаватель успешно добавлен");
          location.reload();
        });       
      });
    }
}
