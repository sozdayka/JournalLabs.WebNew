import { Component,OnInit } from '@angular/core';
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { JournalService } from "../../shared/journal.service";
import { Journal } from '../../models/Journal';
import { StudentJournal } from '../../models/studentJournal';
import { LogService } from '../../shared/log.service';

@Component({
    selector: 'header-menu',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

    
    public userName:string = "";
    public userIcon:string = "";
    public currentRole:string = "";
    public userRole:string = "";
    constructor(public router: Router) {
        
      }
    ngOnInit(): void {
        this.userName = localStorage.getItem('TeacherName');
        if (localStorage.getItem('Role') != null) {
            this.currentRole = localStorage.getItem('Role');//s
            if(localStorage.getItem('Role')=="Admin"){
                  this.userRole = 'Администратор';
                  this.userIcon = "admin";
            }
            if(localStorage.getItem('Role')=="Teacher"){
                    this.userRole = "Преподаватель";
                    this.userIcon = "prepod";
            }
            if(localStorage.getItem('Role')=="Assistant"){
                    this.userRole = "Асспирант";
                    this.userIcon = "aspirant";
            }
          }

    }

    signOut() {
        localStorage.removeItem('Role');
        localStorage.removeItem('TeacherId');
        location.reload();
        this.router.navigate(['sign-in']);
    }
}
