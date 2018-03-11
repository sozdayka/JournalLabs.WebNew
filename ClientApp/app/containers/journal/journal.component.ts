import { Component, OnInit } from '@angular/core';
import { JournalService } from '../../shared/journal.service';
import { LabBlockService } from '../../shared/lab-block.service';
import { KindOfWorkService } from '../../shared/kind-of-work.service';
import { RemarkService } from '../../shared/remark.service';
import { JournalViewModel } from '../../models/journalViewModel';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Student } from "../../models/Student"
import { KindOfWork } from "../../models/kind-of-work"
import { LabBlock } from "../../models/LabBlock"
import { Remark } from "../../models/Remark"
import { HeaderKindOfWorkBlock } from '../../models/headerKindOfWorkBlock';
import { User } from '../../models/User';
import { UserService } from '../../shared/user.service';
import { AssistantsJournalViewModel } from '../../models/assistantsJournalViewModel';
import { TeacherJournalService } from '../../shared/teacher-journal';
import { TeacherJournal } from '../../models/teacherJournal';
import { KindOfMark } from "../../models/enums/KindOfMark"
import { LogService } from '../../shared/log.service';
import { AddStudentToJournalViewModel } from "../../models/addStudentToJournalViewModel";
import { GroupService } from '../../shared/group.service';
import { StudentService } from '../../shared/student.service';
import { Group } from '../../models/Group';
import { SubgroupStudents } from '../../models/subgroupStudents';

import { StudentLabBlocksViewModel } from '../../models/studentLabBlocksViewModel';

import { HeaderService } from '../../shared/header-data.service';

@Component({
  selector: 'journal',
  templateUrl: 'journal.component.html'
})
export class JournalComponent implements OnInit {
  name: string;
  public journalViewModel: JournalViewModel = null;

  public headerKindOfWork: HeaderKindOfWorkBlock[] = [];
  public kindOfMark = KindOfMark;
  public studentId = "";
  public assistantList: AssistantsJournalViewModel[] = [];
  public journalId: string = "";
  public currentRole: string = "";
  public currentTeacherId: string = "";
  public currentDate: string = "";
  public isAddSudent:boolean = false;
  public addStudentToJournalViewModel: AddStudentToJournalViewModel = new AddStudentToJournalViewModel();

  public getArraysForStatistic:{
    IdLabs:string,
    NameLabs:string,
    BolType: boolean,
    Marks:{
      IdStudent:string,
      Mark:number
    }[]
  }[]=[];

  
  public EKTCLabInfo: { 
    name: string, 
    count: number
  }[]=[];

  public MakeLabInfo: { 
    predmet: string, 
    count: number
  }[]=[];

  public EndLabInfo: { 
    predmet: string, 
    count: number
  }[]=[];
  
  public maxMarkInfo: {
    studentName: string, 
    predmet: string, 
    topmark: number
  }[]=[];
  public arr:{
    key:string,
    val:string
  }[]=[];


  public arrayEKTC: {
    name: string, 
    count: number
  }[]=[];

  messageTitle:string;
  messageDes:string;

  public isTotal:boolean = true; 

  public constructor(public journalService: JournalService,
    public labBlockService: LabBlockService,
    public kindOfWorkService: KindOfWorkService,
    public remarkService: RemarkService,
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    public teacherJournalService: TeacherJournalService,
    public logService: LogService,
    public groupService: GroupService,
    private studentService: StudentService,
    private data: HeaderService
  ) {
  }

  public ngOnInit(): void {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    var date = dd.toString();
    var month = mm.toString();
    if (dd < 10) {
      date = '0' + dd;
    }
    if (mm < 10) {
      month = '0' + mm;
    }
    this.currentDate = date + '.' + month + '.' + yyyy;
    this.currentRole = localStorage.getItem('Role');
    this.currentTeacherId = localStorage.getItem('TeacherId');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.headerKindOfWork = [];
      this.addStudentToJournalViewModel.JournalId = params['journalId'];
      this.journalId = params['journalId'];
      this.studentId = params['studentId'];
      if (typeof (this.studentId) == 'undefined') {
        this.getJournal(this.journalId);

      }
      if (typeof (this.studentId) != 'undefined') {
        this.getStudentJournal(this.journalId, this.studentId);
      }
      var assistants = this.teacherJournalService.getAllJournalAssistants(this.journalId).subscribe(response => {
        this.assistantList = response;
      });
    });

  
 
  }

  public changeAssistant(event: any, assistant: AssistantsJournalViewModel) {
    if (event.target.checked) {
      var teacherJournal: TeacherJournal = new TeacherJournal();
      teacherJournal.JournalId = this.journalId;
      teacherJournal.TeacherId = assistant.Id
      this.teacherJournalService.addTeacherToJournal(teacherJournal).subscribe(
        result => {
          var teacherName = localStorage.getItem('TeacherName');
          var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} предоставил доступ к журналу ${this.journalViewModel.JournalModel.LessonName} ассистенту ${assistant.Name}`;
          this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
            console.log("success add assistant");
            this.assistantList = [];
            this.teacherJournalService.getAllJournalAssistants(this.journalId).subscribe(response => {
              this.assistantList = response;
            });
          });          
        });     
      return;
    }
    this.teacherJournalService.deleteTeacherFromJournal(assistant.TeacherJournalId).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} предоставил заблокировал доступ к журналу ${this.journalViewModel.JournalModel.LessonName} ассистенту ${assistant.Name}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success remove assistant");
        });
      });
  }

  public getJournal(journalId: string) {
    this.journalService.getJournal(journalId).subscribe(response => {
      var resp = JSON.stringify(response);
      this.journalViewModel = JSON.parse(resp);

      for (let studentResultForJournal of this.journalViewModel.StudentResultForJournal){
        
        for (let studentLabBlock of studentResultForJournal.StudentLabBlocks)
         {
            studentLabBlock.oldMark = studentLabBlock.Mark;
            
          }
          studentResultForJournal.TotalMark = this.totalMark(studentResultForJournal.StudentLabBlocks);
          this.callAllEts();
      }
      //--------review
      var labBlocksForOneStudent = this.journalViewModel.StudentResultForJournal[0].StudentLabBlocks;

      for (var i = 0; i < labBlocksForOneStudent.length; i++) {       
        this.headerKindOfWork.push({
          KindOfMark: labBlocksForOneStudent[i].KindOfMark,
          isVisible: labBlocksForOneStudent[i].KindOfMark == KindOfMark.FirstMark ? true : false,
          kindOfWorkId: labBlocksForOneStudent[i].KindOfWorkId
        });
      }
      //---------------
      this.data.currentMessageTitle.subscribe(messageTitle => this.messageTitle = messageTitle,messageDes => this.messageDes = messageDes)
      this.data.changeMessage("Журнал "+this.journalViewModel.JournalModel.LessonName+"("+this.journalViewModel.JournalModel.GroupName+")","Работа с журналами")
  
      this.statAvgMark();

      this.getLastModify();

      this.getStatisticArray();
    });
  }
  public getStudentJournal(journalId: string, studentId: string) {
    this.journalService.getJournalByIdAndStudentId(journalId, studentId).subscribe(response => {
      this.journalViewModel = JSON.parse(response._body);
      //--------review
      var labBlocksForOneStudent = this.journalViewModel.StudentResultForJournal[0].StudentLabBlocks;

      for (var i = 0; i < labBlocksForOneStudent.length; i++) {
        this.headerKindOfWork.push({
          KindOfMark: labBlocksForOneStudent[i].KindOfMark,
          isVisible: labBlocksForOneStudent[i].KindOfMark == KindOfMark.FirstMark ? true : false,
          kindOfWorkId: labBlocksForOneStudent[i].KindOfWorkId
        });
      }
      //----------- 
    });
  }

  public changeUserName(student: Student) {
    this.studentService.updateStudent(student).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} изменил имя студента под Id ${student.Id} на ${student.StudentName}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success update user name");
        });

      });
  }
  public changeKindOfWorkName(kindOfWork: KindOfWork) {
    this.kindOfWorkService.updateKindOfWork(kindOfWork).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} изменил настройки Вида работы под Id ${kindOfWork.Id} на
                      название ${kindOfWork.NameKindOfWork}, видимость для ассистента ${kindOfWork.IsKindOfWorkVisible}, видимость для студента ${kindOfWork.IsVisibleToStudent}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success update kindOfWork name");
        });
      });
  }
  public changeRemark(remark: Remark) {
    this.remarkService.updateRemark(remark).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} изменил блок заметок под Id ${remark.Id} на текст заметки ${remark.RemarkText}, видимость студента  ${remark.IsHideStudent}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success update remark");
        });       
      });
  }

  public totalMark(labBlocks: LabBlock[]): number {
    let sum: number = 0;

    this.journalViewModel.KindsOfWorkForJournal.forEach(kindofwork =>{
      let vars:LabBlock []= labBlocks.filter(x => x.KindOfWorkId==kindofwork.Id);
      if(vars.length==2){
        sum += vars[0].Mark > vars[1].Mark? vars[0].Mark : vars[1].Mark;
      }
      if(vars.length==1){
        sum += vars[0].Mark;
      }

    });
   
    return sum;
  }

  public setCurrentDateorYour(keyDate){
    if(!keyDate) return this.currentDate;
    if(new Date(keyDate) < new Date(this.currentDate)) 
    {
      return this.currentDate;
    }else{
      return keyDate;
    }
  }
public onBlurMethod(deadline,current){

  let testConnection = deadline.filter(item=> item.Id == current.KindOfWorkId);
  if(testConnection){
  
if(testConnection[0].Deadline && current.Date){
    var deadlinedate = testConnection[0].Deadline.split(/[.]/); 
    var curdate = current.Date.split(/[.]/); 


var date1 = +new Date(deadlinedate[2]+"-"+deadlinedate[1]+"-"+deadlinedate[0]);
var date2 = +new Date(curdate[2]+"-"+curdate[1]+"-"+curdate[0]);
    if( date1 < date2) 
    {
      return "red";
    }else{
      return "black";
    }
  }
}

}
  public changeLabBlock(studentRow:StudentLabBlocksViewModel, labBlock: LabBlock, event: any) {
    if (labBlock.Date != null) {    
    labBlock.MarkTeacherId = this.currentTeacherId;
    labBlock.MarkTeacherName = localStorage.getItem('TeacherName');

    if (labBlock.oldMark != labBlock.Mark && labBlock.oldMark!=0) {

      studentRow.TotalMark = this.totalMark(studentRow.StudentLabBlocks);
      this.callAllEts();

      if (labBlock.oldMark > labBlock.Mark) {
        labBlock.Color = "red";        
      }
      if (labBlock.oldMark < labBlock.Mark) {
        labBlock.Color = "green";
      }     
    }
    labBlock.oldMark = labBlock.Mark;
    this.labBlockService.updateLabBlock(labBlock).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} изменил блок лабораторной работы под Id ${labBlock.Id} на дату ${labBlock.Date}, оценку ${labBlock.Mark}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success update labBlock");
        });        
      });
    }
  }

  public removeStudent(id: string) {
    this.labBlockService.deleteLabBlockByStudentId(id).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} удалил студента под Id ${id}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success remove student");
          location.reload();
        }); 
      });
  }
  public StudentsChange(students: Student[]) {
    this.addStudentToJournalViewModel.Students = students;
  }

  public addStudentToJournal() {
    if (this.isAddSudent) {
      this.journalService.addStudentToJournal(this.addStudentToJournalViewModel).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} добавил нового студента`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          this.addStudentToJournalViewModel.Students = [];
          console.log("success add student");
          location.reload();
        }); 
      });
    }
    this.isAddSudent = !this.isAddSudent;
    
  }
  public changeVisibleKindOfWork(idKindOfWork: string, isChecked: any) {
    this.kindOfWorkService.updateVisibleKindOfWork(idKindOfWork, isChecked).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} изменил видимость вида работы под Id ${idKindOfWork} на ${isChecked}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success update visible kindOfWork");
          location.reload();
        });
      });
  }
  public removeKindOfWork(idKindOfWork: string) {
    this.kindOfWorkService.deleteKindOfWork(idKindOfWork).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} удалил вид работы под Id ${idKindOfWork}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success remove kindOfWork");
          location.reload();
        }); 
      });
  }
  public addKindOfWorkToJournal() {
    this.journalService.addKindOfWorkToJournal(this.journalId).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} добавил новый вид работы в журнале под ID ${this.journalId}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success add kindOfWork");
          location.reload();
        }); 
      });
  }
  public changeVisibleSecondBlock(key: KindOfWork, isChecked: any) {

    key.isSecondBlockVisible = isChecked;

    var kindOfWork = this.headerKindOfWork.filter(x => x.KindOfMark == KindOfMark.SecondMark && x.kindOfWorkId == key.Id)[0];
    if (kindOfWork) {
      kindOfWork.isVisible = isChecked;
    }

    for (var i = 0; i < this.journalViewModel.StudentResultForJournal.length; i++) {
      var labBlock = this.journalViewModel.StudentResultForJournal[i].StudentLabBlocks.filter(x => x.KindOfMark == KindOfMark.SecondMark && x.KindOfWorkId == key.Id)[0];
      if (labBlock) {
        labBlock.IsSecondBlock = isChecked;
      }
    }
  }
  public changeVisibleKindOfWorkForStudent(idKindOfWork: string, isChecked: any) {
    this.kindOfWorkService.updateVisibleKindOfWorkForStudent(idKindOfWork, isChecked).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} изменил видимость вида работы для студента под Id ${idKindOfWork} на ${isChecked}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success update visible kindOfWork for student");
          location.reload();
        });
      });
  }
  public changeJournalModel() {
    this.journalService.updateJournal(this.journalViewModel.JournalModel).subscribe(
      result => {
        var teacherName = localStorage.getItem('TeacherName');
        var logText = `${new Date().toLocaleString()} Преподаватель ${teacherName} изменил поля в журнале ${this.journalViewModel.JournalModel.Id}`;
        this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
          console.log("success update journal");
        });
      });
  }


  public totalMarkInfo(sum:number,isexma:boolean){
    var returnText: string =" ";

    if(!isexma){
      if(sum<60){
        returnText = "незарах";
      }else{
        returnText = "зарах";
      }
    }else{
      if(90<=sum && sum<=100){
        returnText = "отлично";
      }else if(75<=sum && sum<90){
        returnText = "хорошо";
      }else if(60<=sum && sum<75){
        returnText = "удовлетворительно";
      }else{
        returnText = " ";
      }
      
    }
    return returnText;
  }



  public totalMarkEKTCInfo(sum:number){

    var returnText: string =" ";

      if(90<=sum && sum<=100){
        returnText = "A";
      }
      if(85<=sum && sum<90){
        returnText = "B";
      }
      if(75<=sum && sum<85){
        returnText = "C";
      }
      if(65<=sum && sum<75){
        returnText = "D";
      }
      if(60<=sum && sum<65){
        returnText = "E";
      }
      if(sum<60){
        returnText = "FX";
      }


    return returnText;
  }

  public callAllEts(){
    this.arrayEKTC = [
      { name: "A",count: 0},
      { name: "B",count: 0},
      { name: "C",count: 0},
      { name: "D",count: 0},
      { name: "E",count: 0},
      { name: "FX",count: 0}
    ];

    this.journalViewModel.StudentResultForJournal.forEach(student=>{
    if(90<=student.TotalMark && student.TotalMark<=100){
      this.arrayEKTC[0].count+=1;
    }
    if(85<=student.TotalMark && student.TotalMark<90){
      this.arrayEKTC[1].count+=1;
    }
    if(75<=student.TotalMark && student.TotalMark<85){
      this.arrayEKTC[2].count+=1;
    }
    if(65<=student.TotalMark && student.TotalMark<75){
      this.arrayEKTC[3].count+=1;
    }
    if(60<=student.TotalMark && student.TotalMark<65){
      this.arrayEKTC[4].count+=1;
    }
    if(student.TotalMark<60){
      this.arrayEKTC[5].count+=1;
    }
  });
  }

  
  public getCSSClassesDeadline(i,deadline,current){
    if(deadline[i]){
      
      if(new Date(deadline[i].Deadline) < new Date(current)) 
      {
        return "deadlineend";
      }
    }
  }

 
  public getStatisticArray(){
    this.getArraysForStatistic =[];

    if(this.journalViewModel){
    this.journalViewModel.KindsOfWorkForJournal.forEach(listlab=>{

      let MarksOneLab:{ IdStudent:string,  Mark:number }[]=[];
      let BolTypelab;

      this.journalViewModel.StudentResultForJournal.forEach(sturdent=>{
        sturdent.StudentLabBlocks.forEach(marklab=>{
          if(listlab.Id== marklab.KindOfWorkId){
            MarksOneLab.push({
              IdStudent:sturdent.StudentInfo.Id,
              Mark:marklab.Mark
            });
            BolTypelab = marklab.IsBoolField;
          }
        });



      });
      this.getArraysForStatistic.push({
        IdLabs:listlab.Id,
        NameLabs:listlab.NameKindOfWork,
        BolType: BolTypelab,
        Marks: MarksOneLab
      });
    });
  }
    return this.getArraysForStatistic;
  }

  public findObjectByKeyreturnIndex(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }
    return null;
  }
  public findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
  }

  public getCounOfEndLab(array:any,typeLab,statInfo){

let countOtrab = 0;
let countZdan = 0;
    for (let i = 0; i < array.length; i+=2) {
      if(typeLab){
        if(array[i].Mark==1){
          countOtrab ++;  
        }
        
      }else{
        if(array[i].Mark>0){
          countZdan++;
        }
      }
      
    }
    return statInfo?countOtrab:countZdan;
  }
public statAvgMarksum:number = 0; 

  public statAvgMark(){

    let i = 0;
    let sum = 0;
    let best;
    let maxMark = 0;
    let countMakelab = 0;
    let countEndLabInfo = 0;

    this.MakeLabInfo=[];
    this.maxMarkInfo=[];
    this.EndLabInfo=[];

    this.journalViewModel.StudentResultForJournal.forEach(key2=>{
       
      for (let labBlock of key2.StudentLabBlocks) {
        if (labBlock.IsCalculateMark) {

          if(maxMark<labBlock.Mark) {
            this.maxMarkInfo=[];
            maxMark = labBlock.Mark;
              this.maxMarkInfo.push({topmark : maxMark,
              predmet : this.journalViewModel.JournalModel.LessonName,
              studentName : key2.StudentInfo.StudentName});
          }
          sum += labBlock.Mark;
        }
        if(labBlock.IsBoolField){
          if(labBlock.Mark){

            countMakelab +=1;
          } 
        }else{
          if(labBlock.Mark){
            countEndLabInfo += 1; 
          }
        } 
      }
    });
    this.MakeLabInfo.push({
      predmet:this.journalViewModel.JournalModel.LessonName,
      count:countMakelab
    })
      this.EndLabInfo.push({
        predmet:this.journalViewModel.JournalModel.LessonName,
        count:countEndLabInfo
      })
      this.statAvgMarksum = sum;
  }
  

  public getLastModify(){

  
    this.journalViewModel.StudentResultForJournal.forEach(item => {

      item.StudentLabBlocks.forEach(itemlab =>{

            let selectarr = this.findObjectByKey(this.arr,"key",itemlab.KindOfWorkId);
            if(!selectarr){
              if(itemlab.Date){
              this.arr.push({key:itemlab.KindOfWorkId,val:itemlab.Date});
              }
            }
            if(selectarr && itemlab.Date){
             
              var maxdate = selectarr.val.split(/[.]/); 
              var labdate = itemlab.Date.split(/[.]/); 
              var date1 = +new Date(maxdate[2]+"-"+maxdate[1]+"-"+maxdate[0]);
              var date2 = +new Date(labdate[2]+"-"+labdate[1]+"-"+labdate[0]);
              if( date1 < date2) {
                this.arr.splice(this.arr.indexOf(selectarr), 1);
                this.arr.push({key:itemlab.KindOfWorkId,val:itemlab.Date});
              }
            }

      })

    });
   
  }

  
}
