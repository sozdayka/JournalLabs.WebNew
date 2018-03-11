import { NgModule, Inject } from '@angular/core';
import { Router, RouterModule, PreloadAllModules } from '@angular/router';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, NgModel } from '@angular/forms';

import { Ng2BootstrapModule } from 'ngx-bootstrap';

// i18n support
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';


import { GroupStudentsComponent } from './components/group-students/group-students.component';
import { AdminComponent } from './containers/admin/admin.component';
// import { ChatComponent } from './containers/chat/chat.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { CreateJournalComponent } from './containers/create-journal/create-journal.component';
import { Ng2TableModule } from 'ng2-expanding-table/components/ng-table-module';

import { LinkService } from './shared/link.service';
import { UserService } from './shared/user.service';
// import { ConnectionResolver } from './shared/route.resolver';
import { ORIGIN_URL } from './shared/constants/baseurl.constants';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';
import { JournalComponent } from './containers/journal/journal.component';
import { SignInComponent } from './containers/sign-in/sign-in.component';
import { LabBlockService } from './shared/lab-block.service';
import { JournalService } from './shared/journal.service';
import { KindOfWorkService } from './shared/kind-of-work.service';
import { StudentService } from './shared/student.service';
import { RemarkService } from './shared/remark.service';
import { TeacherJournalService } from './shared/teacher-journal';
import { LogService } from './shared/log.service';

import { CathedrasComponent } from './containers/cathedras/cathedras.component';
import { GroupsComponent } from './containers/groups/groups.component';
import { GroupComponent } from './containers/group/group.component';
import { GroupService } from './shared/group.service';
import { CathedraService } from './shared/cathedra.service';
import { StudentGroupService } from './shared/student-group.service';
import { SearchDataService } from './shared/search-data.service';

import { FilterPipe } from './shared/filter.pipe';
import { ViewLogsComponent } from './containers/view-logs/view-logs.component';

export function createTranslateLoader(http: Http, baseHref) {
    // Temporary Azure hack
    if (baseHref === null && typeof window !== 'undefined') {
        baseHref = window.location.origin;
    }
    // i18n files are in `wwwroot/assets/`
    return new TranslateHttpLoader(http, `${baseHref}/assets/i18n/`, '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        
    HeaderComponent,
    SearchComponent,
    NavMenuComponent,
    FooterComponent,
    UserDetailComponent,


        AdminComponent,
      GroupStudentsComponent,
        // ChatComponent,
        NotFoundComponent,
      CreateJournalComponent,
      JournalComponent,
      SignInComponent,
      
      CathedrasComponent,
      GroupsComponent,
      GroupComponent,
      ViewLogsComponent,

      FilterPipe,

      
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        Ng2BootstrapModule.forRoot(), // You could also split this up if you don't want the Entire Module imported

        TransferHttpModule, // Our Http TransferData method
        Ng2TableModule,

        // i18n support
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http, [ORIGIN_URL]]
            }
        }),

        // App Routing
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'sign-in',
                pathMatch: 'full'
            },           
            {
                path: 'admin', component: AdminComponent,
                data: {
                    title: 'Admin',
                    meta: [{ name: 'description', content: 'Admin' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/counter/something' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/counter' }
                    ]
                }
            },
            //{
            //  path: 'student-journals', component: StudentJournalsComponent,
            //    data: {
            //      title: 'Student Journals',
            //      meta: [{ name: 'description', content: 'Student Journals' }],
            //        links: [
            //            { rel: 'canonical', href: 'http://blogs.example.com/chat/something' },
            //            { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/users' }
            //        ]
            //    }
            //},
            {
              path: 'create-journal', component: CreateJournalComponent,
                data: {
                    title: 'Create journal',
                    meta: [{ name: 'description', content: 'Create journal' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                    ]
                }
            },
            {
              path: 'journal', component: JournalComponent,
              data: {
                title: 'Journal',
                meta: [{ name: 'description', content: 'Journal' }],
                links: [
                  { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                  { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                ]
              }
            },
            {
              path: 'sign-in', component: SignInComponent,
              data: {
                title: 'Sign In',
                meta: [{ name: 'description', content: 'sign-in' }],
                links: [
                  { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                  { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                ]
              }},

              {
                path: 'cathedras', component: CathedrasComponent,
                  data: {
                      title: 'Сathedras list',
                      meta: [{ name: 'description', content: 'Сathedras list' }],
                      links: [
                          { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                          { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                      ]
                  }
              },
              {
                path: 'groups', component: GroupsComponent,
                  data: {
                      title: 'Groups list',
                      meta: [{ name: 'description', content: 'Groups list' }],
                      links: [
                          { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                          { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                      ]
                  }
              },
              {
                path: 'group', component: GroupComponent,
                  data: {
                      title: 'Groups list',
                      meta: [{ name: 'description', content: 'Groups list' }],
                      links: [
                          { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                          { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                      ]
                  }
              },
              {
                path: 'view-logs', component: ViewLogsComponent,
                  data: {
                      title: 'Log list',
                      meta: [{ name: 'description', content: 'Logs list' }],
                      links: [
                          { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                          { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                      ]
                  }
              },
              

            {
                path: '**', component: NotFoundComponent,
                data: {
                    title: '404 - Not found',
                    meta: [{ name: 'description', content: '404 - Error' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                    ]
                }
            }
          
        ], {
          // Router options
          useHash: false,
          preloadingStrategy: PreloadAllModules,
          initialNavigation: 'enabled'
        })
    ],
    providers: [
        LinkService,
        UserService,
        // ConnectionResolver,
        TranslateModule,
        LabBlockService,
        JournalService,
        StudentService,
        KindOfWorkService,
        RemarkService,
      TeacherJournalService,
      LogService,
      GroupService,
      CathedraService,
      StudentGroupService,
      
      SearchDataService
    ]
})
export class AppModuleShared {
}
