import { Component,OnInit } from '@angular/core';
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { JournalService } from "../../shared/journal.service";
import { Journal } from '../../models/Journal';
import { StudentJournal } from '../../models/studentJournal';
import { LogService } from '../../shared/log.service';

@Component({
    selector: 'footer-menu',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
    

    ngOnInit(): void {

    }
}
