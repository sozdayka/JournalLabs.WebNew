import { Component } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from '../../shared/user.service';
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { LogService } from '../../shared/log.service';
@Component({
  selector: 'sign-in',
  template: `
  <div class="col-md-4 mx-auto">

  <div class="page-brand">
  <img src="../../assets/img/logo-j.png" alt="JournalLabs">
  </div>

  <div class="card card-default widget animated" style="animation-delay: -0.06s;">
    <div class="card-heading">
      <h3 class="card-title">Войти как преподаватель</h3>
    </div>
    <div class="card-body">
      
        <div class="form-group">
          <label>Введите логин</label>
          <input type="text" class="form-control" [(ngModel)]="teacherModel.Login" name="Login">
        </div>
        <div class="form-group">
          <label>Введите пароль</label>
          <input type="password" class="form-control" [(ngModel)]="teacherModel.Password" name="Password">
        </div>
        <button type="submit" (click)="SignIn()" class="btn btn-success btn-block btn-lg">Войти</button>
      

      
    </div>
  </div>

</div>
  `
})
export class SignInComponent {
  /*Input Email:*/
  /*Input your Email and password to sign in into site*/
  /*Input password:*/
  /*Sign in*/
  public teacherModel: User = { Id: "", Login: "", Password: "111111", Role: "", CathedraId:"" };

  constructor(public router: Router,
    private userService: UserService, private logService: LogService) { }

  public SignIn() {
    //this.teacherModel.Role = "Teacher";
    this.userService.signInUser(this.teacherModel).subscribe(response => {
      var logText = `${new Date().toLocaleString()} Пользователь ${this.teacherModel.Login} успешно авторизирован`;
      this.logService.writeTeacherLog(logText,"user").subscribe(resp => {
        var result: User = JSON.parse(response._body);
        if (result.Role == "Teacher" || result.Role == "Assistant") {
          localStorage.setItem('Role', result.Role);
          localStorage.setItem('TeacherId', result.Id);
          localStorage.setItem('TeacherName', result.Login);
         location.reload();
         // this.router.navigate(['teacher-journals']);
         return;
        }
        if (result.Role == "Admin") {
          localStorage.setItem('Role', result.Role);
         location.reload();
         this.router.navigate(['admin']);
         return;
        }
      });
    });
  }
}
