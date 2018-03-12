import { Component,OnInit } from '@angular/core';
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { JournalService } from "../../shared/journal.service";
import { Journal } from '../../models/Journal';
import { StudentJournal } from '../../models/studentJournal';
import { LogService } from '../../shared/log.service';

import { SearchDataService } from "../../shared/search-data.service";
import { HeaderService } from "../../shared/header-data.service";

@Component({
    selector: 'search-menu',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
    message:string;
    messageTitle:string;
    messageDes:string;

    public studentJournals: StudentJournal[] = [];
    public studentName:string="";


    constructor(public router: Router,
        private journalService: JournalService,
        private logService: LogService,
        private data: HeaderService,
        private searchdata: SearchDataService) {
        
      }

    ngOnInit(): void {
        this.searchdata.currentMessageStudentJournals.subscribe(message  => this.studentJournals = message )

        if (this.studentName != "") {
            this.journalService.getAllStudentJournalsByStudentName(this.studentName).subscribe(response => {
              this.studentJournals = JSON.parse(response._body);
              this.router.navigate(['journal'], { queryParams: { journalId: this.studentJournals[0].JournalId, studentId: this.studentJournals[0].StudentId } });
              this.searchdata.changeMessage(this.studentJournals)
            });
            //this.searchdata.changeMessage(this.studentJournals)
          }
    }

    public StudentSearch() {
        this.journalService.getAllStudentJournalsByStudentName(this.studentName).subscribe(response => {
          this.studentJournals = JSON.parse(response._body);
          
          this.router.navigate(['journal'], { queryParams: { journalId: this.studentJournals[0].JournalId, studentId: this.studentJournals[0].StudentId } });
          this.searchdata.changeMessage(this.studentJournals)

          this.data.currentMessageTitle.subscribe(messageTitle => this.messageTitle = messageTitle,messageDes => this.messageDes = messageDes)
          this.data.changeMessage("Результат поиска по запросу","Поиск студента: "+this.studentName)
      
        });
      console.log(this.studentName); 
      }
    
}
