import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommonService {
  months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  constructor(
    private router: Router,
    public _http: HttpClient
  ) {}

  postCall(url: any, obj: any) {
    return new Promise((resolve, reject) => {
        this._http.post('http://localhost:3000/' + url, obj)
        .subscribe((data: any) => {
          console.log('HTTP Response')
          console.log(data)
          resolve(data);
        }, (err)=>{
            console.log('HTTP Error Response')
            console.log(err)
            reject(err)
        });
    });
  }

  getDate(date: any){
    return date ? new Date(date).getDate() : new Date().getDate();
  }

  getMonth(date: any){
      return date ? new Date(date).getMonth() : new Date().getMonth();
  }

  getFullYear(date: any){
      return date ? new Date(date).getFullYear() : new Date().getFullYear();;
  }

}