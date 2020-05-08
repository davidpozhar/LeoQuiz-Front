import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { IUserData } from "../interfaces/user-data";
import { environment } from "../../environments/environment";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class SignInUpService {
  private tokenExpirationTimer: any;
  user: IUserData;
  constructor(private http: HttpClient, private router: Router) {}

  signUp(userSignUpData: IUserData) {
    return this.http
      .post<string>(environment.apiUrl + "/Account/SignUp", userSignUpData)
      .pipe(
        catchError(this.errorHandling),
        tap((responseData) => {
          this.authHandling(responseData
          );
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
          this.authHandling(responseData
          );
        })
      );
  }

  getUserInfoById() {
    console.log("Login!");
    return this.http.get<IUserData>(
      environment.apiUrl +
        "/User/GetCurrentUser" + "Bearer " + localStorage.getItem(JSON.parse("token")),//{headers: }
        
        
    ).pipe(
        catchError(this.errorHandling),
        tap((responseData) => {
          this.userHandling(responseData.email, responseData.name, responseData.surname, responseData.userRole
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
  }

  logout() {
    this.http
      .get(
        environment.apiUrl +
          "/Account/Logout"
      )
    this.router.navigate(["/login"]);
    localStorage.removeItem("userData");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  private authHandling(token: string) {
    localStorage.setItem("string", JSON.stringify(token));
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
