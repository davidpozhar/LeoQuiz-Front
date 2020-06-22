import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, of, BehaviorSubject } from "rxjs";
import { share, map } from "rxjs/operators";
import { IUserData } from "../interfaces/user-data";
import { environment } from "../../environments/environment";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import { AuthErrors } from "../classes/error";
import { User } from "../classes/user";

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(
    private http: HttpClient,
    private decoder: JwtHelperService,
    private router: Router
  ) {}

  signUp(userSignUpData: IUserData) {
    return this.http
      .post<string>(environment.apiUrl + "/Account/SignUp", userSignUpData, {
        responseType: "text" as "json",
      })
      .pipe(
        catchError(this.errorHandler),
        tap((responseData) => {
          this.authHandling(responseData);
        })
      );
  }

  singIn(userLoginInData: IUserData) {
    console.log(userLoginInData);
    return this.http
      .post<string>(environment.apiUrl + "/Account/SignIn", userLoginInData, {
        responseType: "text" as "json",
      })
      .pipe(
        catchError(this.errorHandler),
        tap((responseData) => {
          this.authHandling(responseData);
        })
      );
  }

  getUserInfo() {
    console.log("getUserInfo!");
    return this.http
      .get<IUserData>(environment.apiUrl + "/User/GetCurrentUser")
      .pipe(
        catchError(this.errorHandler),
        tap((responseData) => {
          console.log("responseData: ");
          console.log(responseData);
          this.userHandling(
            responseData.email,
            responseData.name,
            responseData.surname,
            responseData.userRoleId
          );
        })
      );
  }

  autoLogin() {
    console.log("authlogin");
    const userData: User = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.userRole
    );
    this.user.next(loadedUser);
  }

  logout() {
    this.user.next(null);
    this.http.get(environment.apiUrl + "/Account/Logout");
    this.router.navigate(["/login"]);
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  private authHandling(token: string) {
    console.log("setToken");
    localStorage.setItem("token", JSON.stringify(token));
  }

  private userHandling(
    email: string,
    name: string,
    surname: string,
    userRole: number
  ) {
    console.log("SetUserData");
    console.log("Role: " + userRole);
    const userData: IUserData = {
      email: email,
      name: name,
      surname: surname,
      userRole: userRole,
    };
    const userAuth = new User(email, userRole);
    this.user.next(userAuth);
    console.log("userHandling object: ");
    console.log(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  refreshToken(): Observable<string> {
    const url = environment.apiUrl + "/Account/RefreshToken";

    const refreshToken = localStorage.getItem("refreshToken");
    const expiredToken = JSON.parse(localStorage.getItem("token"));

    return this.http
      .get(url, {
        headers: new HttpHeaders()
          .set("refreshToken", refreshToken)
          .set("token", expiredToken),
        observe: "response",
      })
      .pipe(
        share(),
        map((res) => {
          const token = res.headers.get("token");
          const newRefreshToken = res.headers.get("refreshToken");

          localStorage.setItem("refreshToken", JSON.stringify(newRefreshToken));
          localStorage.setItem("token", JSON.stringify(token));

          return token;
        })
      );
  }

  getToken(): Observable<string> {
    const token = JSON.parse(localStorage.getItem("token"));
    const isTokenExpired = this.decoder.isTokenExpired(token);

    if (!isTokenExpired) {
      return of(token);
    }

    return this.refreshToken();
  }

  private errorHandler(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);
    switch (errorResponse.error.Message) {
      case AuthErrors.wrongPassword: {
        return throwError(errorResponse.error.Message);
      }
      case AuthErrors.emailInUse: {
        return throwError(errorResponse.error.Message);
      }
      case AuthErrors.noEmail: {
        return throwError(errorResponse.error.Message);
      }
    }

    return throwError({
      name: errorResponse.name,
      message: errorResponse.message,
    });
  }
}
