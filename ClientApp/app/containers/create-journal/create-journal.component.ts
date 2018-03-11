import { Component } from '@angular/core';
import { JournalService } from '../../shared/journal.service';
import { UserService } from '../../shared/user.service';
import { CreateJournalViewModel } from "../../models/createJournalViewModel"
import { User } from '../../models/User';
import { LabBlock } from '../../models/LabBlock';
import { LogService } from '../../shared/log.service';

import { GroupService } from '../../shared/group.service';
import { StudentGroupService } from '../../shared/student-group.service';
import { StudentService } from '../../shared/student.service';
import { Group } from '../../models/Group';
import { Student } from '../../models/Student';

import { AddStudentToJournalViewModel } from "../../models/addStudentToJournalViewModel";

@Component({
  selector: 'create-journal',
  templateUrl: './create-journal.component.html'
})
export class CreateJournalComponent {
  public studntOfGroupArray: {id:string, groupName:string, students: Student} []=[];

  public assistantList: User[] = [];
  public labBlockCount: number = 0;
  public createJournalViewModel: CreateJournalViewModel = new CreateJournalViewModel();
  public constructor(public journalService: JournalService, public userService: UserService, public logService: LogService, public groupService: GroupService,public studentGroupService: StudentGroupService ,public studentService:StudentService) {
    var assistants = this.userService.getAllAssistants().subscribe(response => {
      this.assistantList = response;
    });
    
    
  }
  public ngOnInit(): void {
  }


  public addAssistant(event: any, id: string) {
    if (event.target.checked) {
      this.createJournalViewModel.TeacherIds.push(id);
      return;
    }
    this.createJournalViewModel.TeacherIds = this.createJournalViewModel.TeacherIds.filter(obj => obj !== id);
  }
  public createJournal() {
    var teacherName = localStorage.getItem('TeacherName');
    this.createJournalViewModel.TeacherIds.push(localStorage.getItem('TeacherId'));

    this.journalService.addJournal(this.createJournalViewModel).subscribe(resp => {


      var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} создал журнал под названием: ${this.createJournalViewModel.LessonName}, и количеством видов работ ${this.createJournalViewModel.LabBlocksSettings.length}`;
      this.logService.writeTeacherLog(logText,"user").subscribe(response => {
        alert("Журнал успешно добавлен");
        location.reload();
      });
    });
  }
  public fillLabBlockSettingsArray() {
    this.createJournalViewModel.LabBlocksSettings = [];
    for (var i = 0; i < this.labBlockCount; i++) {
      this.createJournalViewModel.LabBlocksSettings.push(new LabBlock());
    }
  }
  public selectBooleanTypeField(key: LabBlock, isChecked: any) {
    key.IsBoolField = isChecked;
    if (isChecked) {
      key.IsCalculateMark = false;
    }

  }

  public StudentsChange(students: Student[]) {
    this.createJournalViewModel.Students = students;
  }




  
  
  
    

  

}
