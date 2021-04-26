import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class AuthService implements CanActivate {
    constructor(
        private router: Router,
        public _http: HttpClient,
        public c: CommonService
    ) {}

    async canActivate() {
        console.log(localStorage.token)
        if(localStorage.token || this.c.guest){
            return true;
        }
        else{
            localStorage.clear();
            this.router.navigateByUrl("/login");
            return false;
        }
    }
    
}