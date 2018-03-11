import { Component, OnInit } from '@angular/core';

import { LogService } from '../../shared/log.service';
import { Log } from '../../models/Log';

import { HeaderService } from '../../shared/header-data.service';

@Component({
  selector: 'view-logs',
  templateUrl: 'view-logs.component.html'
})
export class ViewLogsComponent implements OnInit {
  public typeLogs='user'; // admin/user
  public viewLog=[];

  public logsArr:Log[]=[];
  messageTitle:string;
  messageDes:string;

  public constructor(
    private data: HeaderService,
    public logService: LogService
  ) {
  }

  public ngOnInit(): void {
    //this.filterChange("user");
    
    this.loadLogs();
    this.data.currentMessageTitle.subscribe(messageTitle => this.messageTitle = messageTitle,messageDes => this.messageDes = messageDes)
    this.data.changeMessage("Просмотр логов:"+this.typeLogs,"Работа с логированием")
   

  }

  public loadLogs() {

        
    this.logService.getLogs(this.typeLogs).subscribe(data => {
      this.logsArr = [];
      var responseArray = JSON.stringify(data);
      this.logsArr = JSON.parse(responseArray);
     
      console.log("Groups loaded successfully");
    });
  }

  public filterChange(view){
    this.typeLogs = view; 
    this.loadLogs();
    this.data.currentMessageTitle.subscribe(messageTitle => this.messageTitle = messageTitle,messageDes => this.messageDes = messageDes)
    this.data.changeMessage("Просмотр логов:"+this.typeLogs,"Работа с логированием")
   
  }

 
}
