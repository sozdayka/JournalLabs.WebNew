import { Component, OnInit } from '@angular/core';

import { LogService } from '../../shared/log.service';
import { GroupService } from '../../shared/group.service';
import { Group } from '../../models/Group';
@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {
  Name: string;
  

  groupName = '';
  groupStudentCount = 0;
  public newGroup: Group = new Group();

  public groupsArray: Group[]= [];



  public constructor(

    public logService: LogService,
    public groupService: GroupService
  ) {
  }

  public ngOnInit(): void {
    this.loadGroups();
  }
  public loadGroups() {
    this.groupService.getGroups().subscribe(data => {
      this.groupsArray = [];
      var responseArray = JSON.stringify(data);
      this.groupsArray = JSON.parse(responseArray);
      console.log("Groups loaded successfully");
    });
  }
  public addGroup():void{
    this.groupService.addGroup(this.newGroup).subscribe(responce => {
      this.newGroup = new Group();
      console.log("Group create successfully");
      var logText = `${new Date().toLocaleString()} Администратор дабавил группу: ${this.newGroup}`;
        this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
          
        });

      this.loadGroups();
    })
  }

  public changeGroupName(groupsArr){
    console.log("Change group Name: "+groupsArr.gName);
  }
  public changeGroupStudentCount(groupsArr){
    console.log("Change group Count: "+groupsArr.gName);
  }
  public removeGroup(group:Group,groupDelrow){
    this.groupService.deleteGroup(group.Id).subscribe(responce => {
      console.log("Delete group : " + group.Name);
      this.groupsArray.splice(groupDelrow, 1);

      var logText = `${new Date().toLocaleString()} Администратор удалил группу: ${group.Name}`;
        this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
          console.log("success update kindOfWork name");
        });
    });
    
    
  }
  
}
