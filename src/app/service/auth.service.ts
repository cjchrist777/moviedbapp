import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService implements CanActivate {
    constructor(
        private router: Router,
        public _http: HttpClient
    ) {}

    async canActivate() {
        console.log(localStorage.token)
        if(localStorage.token){
            return true;
        }
        else{
            localStorage.clear();
            this.router.navigateByUrl("/login");
            return false;
        }
    }
    
}