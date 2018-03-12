import { Component,OnInit } from '@angular/core';
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { JournalService } from "../../shared/journal.service";
import { Journal } from '../../models/Journal';
import { StudentJournal } from '../../models/studentJournal';
import { LogService } from '../../shared/log.service';

import { SearchDataService } from '../../shared/search-data.service';
import { FilterPipe } from '../../shared/filter.pipe';
class FilterClass {
  name: string;
  selected: boolean = true;
}
@Component({
  selector: 'nav-menu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})



export class NavMenuComponent implements OnInit {

  menulist: boolean = false;
  collapse: string = "collapse";

  currentRole: string = "";

  public searchText: Journal[];
  public lessonArray: FilterClass[] = [];
  public groupsArray: FilterClass[] = [];

  public teacherJournals: Journal[] = [];
  public filteredJournals: Journal[] = [];
  public studentJournals: StudentJournal[] = [];
  public studentName: string = "";
  constructor(public router: Router,
    private journalService: JournalService,
    private logService: LogService,
    private searchdata: SearchDataService) {

  }
  
  collapseNavbar(): void {
    if (this.collapse.length > 1) {
      this.collapse = "";
    } else {
      this.collapse = "collapse";
    }
  }

  ngOnInit(): void {

    if (localStorage.getItem('Role') != null) {
      this.currentRole = localStorage.getItem('Role');
    }
    if (this.currentRole != null && this.currentRole == "Admin") {
      this.router.navigate(['admin']);
      return;
    }
    if (localStorage.getItem('TeacherId') != null) {
      this.journalService.getAllJournalsByTeacherId(localStorage.getItem('TeacherId'), this.currentRole).subscribe(response => {
        if (response._body != "[]") {
          //console.log(response);
          this.teacherJournals = JSON.parse(response._body);
          // console.log("***  ****");
          this.filteredJournals = Object.assign([], this.teacherJournals);
          //this.predmetsArr.push(this.teacherJournals.map(item => item.Id));
          var lessons = this.teacherJournals.map(x => x.LessonName).filter((value, index, self)=> { 
            return self.indexOf(value) === index;
          });
          var groups = this.teacherJournals.map(x => x.GroupName).filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
          lessons.forEach(el => {
            this.lessonArray.push({ name:el, selected:true })
          });
          groups.forEach(el => {
            this.groupsArray.push({ name: el, selected: true })
          });
          this.router.navigate(['journal'], { queryParams: { journalId: this.teacherJournals[0].Id } });
          return;
        }
        if (response._body == "[]" && this.currentRole == "Teacher") {
          this.router.navigate(['create-journal']);
          return;
        }
        if (response._body == "[]" && this.currentRole != "Teacher") {
          this.router.navigate(['**']);
          return;
        }
      });
    }
    if (this.studentName != "") {
      this.journalService.getAllStudentJournalsByStudentName(this.studentName).subscribe(response => {
        this.studentJournals = JSON.parse(response._body);
        this.router.navigate(['journal'], { queryParams: { journalId: this.studentJournals[0].JournalId, studentId: this.studentJournals[0].StudentId } });
      });
    }
    if (localStorage.getItem('Role') == null && this.studentName=="") {
      this.router.navigate(['sign-in']);
    }

    this.searchdata.currentMessageStudentJournals.subscribe(message  => this.studentJournals = message )
  }

  signOut() {
    localStorage.removeItem('Role');
    localStorage.removeItem('TeacherId');
    location.reload();
    this.router.navigate(['sign-in']);
  }

  collapseMenu() {
    this.collapse = "collapse"
  }

  public StudentSearch() {
    this.journalService.getAllStudentJournalsByStudentName(this.studentName).subscribe(response => {
      this.studentJournals = JSON.parse(response._body);
      this.router.navigate(['journal'], { queryParams: { journalId: this.studentJournals[0].JournalId, studentId: this.studentJournals[0].StudentId } });
    });

  }
  public addDevelopmentRemak(event: any) {
    this.logService.writeDevelopmentLog(`${new Date().toLocaleString()} -- ${event.target.value}`).subscribe(resp => {
      console.log("Лог успешно записан");
    });
  }

  toggleMenu(): void {
    this.menulist = !this.menulist;

  }

  public functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }
  public clearFilterSelected() {
    this.lessonArray.forEach(item=>{
      item.selected = true;
    });
    this.groupsArray.forEach(item=>{
      item.selected = true;
    });

    this.filteredJournals = this.teacherJournals.filter(s => {
      return this.lessonArray.some(x => x.name === s.LessonName && x.selected == true) 
		  || this.groupsArray.some(x => x.name === s.GroupName && x.selected == true);
    });

  }
  public getFilterSelected() {
    // console.log(this.teacherJournals);
    // console.log(this.lessonArray);
    this.filteredJournals = this.teacherJournals.filter(s => {
      return this.lessonArray.some(x => x.name === s.LessonName && x.selected == true) 
		  || this.groupsArray.some(x => x.name === s.GroupName && x.selected == true);
    });

  }
}
