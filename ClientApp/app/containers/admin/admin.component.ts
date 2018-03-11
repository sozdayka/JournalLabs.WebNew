import { Component,OnInit } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from '../../shared/user.service';
import { NgModel } from '@angular/forms';
import { LogService } from '../../shared/log.service';
import { CathedraService } from '../../shared/cathedra.service';
import { Cathedra } from '../../models/Cathedra';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  public teacherModel: User = { Id: "", Login: "", Password: "111111", Role: "Teacher", CathedraId:"" };
  public cathedrasList: Cathedra[] = [];
  constructor(private userService: UserService,
    private logService: LogService,
    private cathedraService: CathedraService) { }
  ngOnInit() {
    this.loadCathedras();
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
