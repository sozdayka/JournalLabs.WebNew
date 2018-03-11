import { Component, OnInit } from '@angular/core';

import { LogService } from '../../shared/log.service';
import { Log } from '../../models/Log';
@Component({
  selector: 'view-logs',
  templateUrl: 'view-logs.component.html'
})
export class ViewLogsComponent implements OnInit {
  public typeLogs='user'; // admin/user
  public viewLog=[];

  public logsArr:Log[]=[];


  public constructor(
   
    public logService: LogService
  ) {
  }

  public ngOnInit(): void {
    //this.filterChange("user");
    
    this.loadLogs();
          

  }

  public loadLogs() {

        
    this.logService.getLogs(this.typeLogs).subscribe(data => {
      this.logsArr = [];
      var responseArray = JSON.stringify(data);
      this.logsArr = JSON.parse(responseArray);
      console.log(responseArray);
      console.log("Groups loaded successfully");
    });
  }

  public filterChange(view){
    this.typeLogs = view; 
    this.loadLogs();
  }

 
}
