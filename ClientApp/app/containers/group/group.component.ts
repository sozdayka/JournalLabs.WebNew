import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { LogService } from '../../shared/log.service';

import { GroupService } from '../../shared/group.service';

import { StudentService } from '../../shared/student.service';

import { Group } from '../../models/Group';

import { Student } from '../../models/Student';
import { StudentGroupService } from '../../shared/student-group.service';
import { AddStudentToGroup } from '../../models/addStudentToGroup';

@Component({
  selector: 'group',
  templateUrl: 'group.component.html'
})
export class GroupComponent implements OnInit {
 
  groupInfo: Group = new Group();
  student: AddStudentToGroup = new AddStudentToGroup();
  groupStudents: Student[] = [];



  groupId:string = "";
  StudentName = '';




  public constructor(
    private route: ActivatedRoute,

    public logService: LogService,
    public groupService: GroupService,
    public studentService: StudentService,
    public studentGroupService: StudentGroupService
  ) {
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {

      this.groupId = params['groupid'];
      this.loadGroupInfo(this.groupId);
      this.loadStudents();
    });    
  }

  public loadGroupInfo(groupId: string) {
    this.groupService.getGroup(groupId).subscribe(data => {
      this.groupInfo = data;
      console.log("Group loaded successfully");
    });
  }

  public loadStudents() {
    this.studentService.getStudentsByGroupId(this.groupId).subscribe(data => {
      this.groupStudents = data;
      console.log("Group loaded successfully");
    });
  }
  public addStudent(): void{
    this.student.GroupId = this.groupId;
    this.studentGroupService.addStudentToGroup(this.student).subscribe(
      response => {
        this.groupStudents.push({
          Id: JSON.parse(response._body),
          StudentName:this.student.Student.StudentName
        });
        this.student.Student = new Student();
        console.log("Student create successfully");
        var logText = `${new Date().toLocaleString()} Администратор в группу ${this.groupInfo.Name} добавил студена: ${this.student.Student.StudentName}`;
        this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
          
        });
      });
    
     

  }
  public changeGroupName() {
    this.groupService.updateGroup(this.groupInfo).subscribe(response => {
      console.log("Change group Name: " + this.groupInfo.Name);
      var logText = `${new Date().toLocaleString()} Администратор изменил название группы ${this.groupInfo.Name}`;
      this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
        
      });
    });
  }
  public changeStudentName(student: Student) {
    this.studentService.updateStudent(student).subscribe(response => {
      console.log("Change student Name: " + student.StudentName);
      var logText = `${new Date().toLocaleString()} Администратор в группу ${this.groupInfo.Name} изменил ФИО студена на: ${student.StudentName}`;
      this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
        
      });
    });
  }
  public removeStudent(studentDelete: Student,index:number) {

    this.studentService.deleteStudent(studentDelete.Id).subscribe(response => {
      console.log("Delete from group, student Name: " + this.groupStudents[index].StudentName);

      var logText = `${new Date().toLocaleString()} Администратор удалил из группу ${this.groupInfo.Name} студена: ${this.groupStudents[index].StudentName}`;
      this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
        
      });

      this.groupStudents.splice(index, 1);
    });
  }

}
