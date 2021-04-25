import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommonService {
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
            if(data && data.statusCode == 200){
                resolve(data.body);
            }
            else{
              reject(data)
            }
        }, (err)=>{
            console.log('HTTP Error Response')
            console.log(err)
            reject(err)
        });
    });
  }

}