import { Component, OnInit } from '@angular/core';

import { LogService } from '../../shared/log.service';
import { CathedraService } from '../../shared/cathedra.service';
import { Cathedra } from '../../models/Cathedra';
@Component({
  selector: 'cathedras',
  templateUrl: 'cathedras.component.html'
})
export class CathedrasComponent implements OnInit {


  //http://journallabs.pp.ua/api/Cathedra/GetCathedras
  //http://journallabs.pp.ua/api/Cathedra/GetCathedras

  public newCathedra: Cathedra = new Cathedra();
  public cathedrasArray: Cathedra[]= [];

  public constructor(

    public logService: LogService,
    public cathedraService: CathedraService
  ) {
  }

  public ngOnInit(): void {
    this.loadCathedras();
  }
  public loadCathedras() {
    this.cathedraService.getCathedras().subscribe(data => {
      this.cathedrasArray = [];
      var responseArray = JSON.stringify(data);
      this.cathedrasArray = JSON.parse(responseArray);
      console.log("Cathedrs loaded successfully");
    });
  }
  public addCathedra():void{

    this.cathedraService.addCathedra(this.newCathedra).subscribe(responce => {
      this.newCathedra = new Cathedra();
      console.log("Cathedra create successfully");
      var logText = `${new Date().toLocaleString()} Администратор добавил кафедру ${this.newCathedra.FullName}`;
      this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
        console.log(resp);
      });
      this.loadCathedras();
    })

  }
  public changeCathedraName(cathedra: Cathedra) {
    this.cathedraService.updateCathedra(cathedra).subscribe(responce => {
      console.log("Change cathedra Name: " + cathedra.FullName);

      var logText = `${new Date().toLocaleString()} Администратор изменил название кафедры ${cathedra.FullName}`;
      this.logService.writeTeacherLog(logText,"admin").subscribe(resp => {
        console.log(resp);
      });


    });
    
  }
  public removeCathedra(cathedra:Cathedra,cathedraDelrow){
    this.cathedraService.deleteCathedra(cathedra.Id).subscribe(responce => {
      console.log("Delete cathedra : " + cathedra.ShortName);
      this.cathedrasArray.splice(cathedraDelrow, 1);
 
    })


  }
}
