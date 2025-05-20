import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Route } from '@angular/router';
import { Router } from '@angular/router';
// import { UsersService } from 'src/app/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor(private router: Router) { }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   if (localStorage.getItem('isLoggedin')) {
  //     // logged in so return true
  //     return true;
  //   }

  //   // not logged in so redirect to login page with the return url
  //   this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  //   return false;
  // }

  constructor(private router: Router, private http: HttpClient) {}

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }


  canActivate() {
    if(sessionStorage.getItem('token')) {
      console.log("auth token",sessionStorage.getItem('token'))
      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }


  // canLoad(route: Route): boolean {
  //    let shouldLoadUsersModule = 0;
  //   if (shouldLoadUsersModule == 0) {
  //     return true; // Allow loading the module
  //   } else {
  //     // Redirect to a different route or show an error message
  //     this.router.navigate(['/dashboard']); // Redirect to dashboard or any other route
  //     return false; // Prevent loading the module
  //   }
  // }
}
