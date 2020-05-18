import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { IUserData } from "../interfaces/user-data";
import { environment } from "../../environments/environment";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router } from "@angular/router";


@Injectable()
export class AuthService {
  private tokenExpirationTimer: any;
  user: IUserData;
  constructor(private http: HttpClient, private decoder: JwtHelperService,private router: Router) {}

  signUp(userSignUpData: IUserData) {
    return this.http
      .post<string>(environment.apiUrl + "/Account/SignUp", userSignUpData)
      .pipe(
        catchError(this.errorHandling),
        tap((responseData) => {
          this.authHandling(responseData);
        })
      );
  }

  singIn(userLoginInData: IUserData) {
    console.log(userLoginInData);
    return this.http
      .post<string>(environment.apiUrl + "/Account/SignIn", userLoginInData)
      .pipe(
        catchError(this.errorHandling),
        tap((responseData) => {
          this.authHandling(responseData);
        })
      );
  }

  getUserInfo() {
    console.log("Login!");
    return this.http
      .get<IUserData>(environment.apiUrl + "/User/GetCurrentUser")
      .pipe(
        catchError(this.errorHandling),
        tap((responseData) => {
          this.userHandling(
            responseData.email,
            responseData.name,
            responseData.surname,
            responseData.userRole
          );
        })
      );
  }

  autoLogin() {
    const userData: IUserData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }
    const loadedUser: IUserData = {
      email: userData.email,
      name: userData.name,
      surname: userData.surname,
      id: userData.id,
      userRole: userData.userRole,
    };
    return;
  }

  logout() {
    this.http.get(environment.apiUrl + "/Account/Logout");
    this.router.navigate(["/login"]);
    localStorage.removeItem("userData");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  private authHandling(token: string) {
    localStorage.setItem("string", JSON.stringify(token));
    this.getUserInfo();
  }

  private userHandling(
    email: string,
    name: string,
    surname: string,
    userRole: string
  ) {
    const user: IUserData = {
      email: email,
      name: name,
      surname: surname,
      userRole: userRole,
    };
    localStorage.setItem("userData", JSON.stringify(user));
  }

  refreshToken(): Observable<string> {
    const url = 'url to refresh token here';

    const refreshToken = localStorage.getItem('refreshToken');
    const expiredToken = localStorage.getItem('token');

    return this.http
      .get(url, {
        headers: new HttpHeaders()
          .set('refreshToken', refreshToken)
          .set('token', expiredToken),
        observe: 'response'
      })
      .pipe(
        share(),
        map(res => {
          const token = res.headers.get('token');
          const newRefreshToken = res.headers.get('refreshToken');

          localStorage.setItem('refreshToken', newRefreshToken);
          localStorage.setItem('token', token);

          return token;
        })
      );
  }

  getToken(): Observable<string> {
    const token = localStorage.getItem('token');
    const isTokenExpired = this.decoder.isTokenExpired(token);

    if (!isTokenExpired) {
      return of(token);
    }

    return this.refreshToken();
  }
  private errorHandling(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);

    switch (errorResponse.error) {
      case "Bad password": {
        return throwError(errorResponse.error);
      }
      case "Email is in use.": {
        return throwError(errorResponse.error);
      }
      case "There is no email": {
        return throwError(errorResponse.error);
      }
    }

    return throwError({
      name: errorResponse.name,
      message: errorResponse.message,
    });
  }
}
