import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor  {

    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loginData = sessionStorage.getItem("token");
        if(loginData) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${loginData}`
                }
            })
        }
        return next.handle(request)
    }
}