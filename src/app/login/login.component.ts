import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
username: any = '';
password: any = '';
  constructor(public c: CommonService, public router: Router) { }

  ngOnInit(): void {
    this.c.headeroptions = false;
    if(!this.c.guest && localStorage.token){
      this.router.navigateByUrl("/")
    }
  }

  isValid(){
    if(this.username.toLowerCase().trim() && this.password){
      return true;
    }
    return false;
  }

  async login(){
    try{
      console.log('login')
      const response = await this.c.postCall('auth',{
        username: this.username,
        password: this.password
      });

      const data: any = await response
      console.log(data);

      if(data.success){
        localStorage.token = data.token;
        this.c.token = data.token;
        localStorage.guest = "";
        this.c.guest = false;
        this.router.navigateByUrl("/")
      }
      else{
        alert("That's not right.")
      }
    }
    catch(e){
      console.log('Catch error')
      console.log(e);
    }
  }

}
