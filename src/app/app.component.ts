import {
  Component
} from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "./service/common.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(public c: CommonService, public router: Router) {
    if(!localStorage.token){
      localStorage.guest = 'Y'
      this.c.guest = localStorage.guest;
    }
  }

  login(){
    localStorage.clear()
    this.router.navigateByUrl("/login");
  }

  dashboard(){
    this.router.navigateByUrl("/");
  }

  logout(){
    if(confirm('Are you sure you want to logout?')){
      localStorage.clear()
      this.router.navigateByUrl("/login");
    }
  }
}
