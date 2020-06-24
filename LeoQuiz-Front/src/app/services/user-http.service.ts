import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { IUserData } from "../interfaces/user-data";
import { environment } from "../../environments/environment";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { AuthErrors } from "../classes/error";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  getInterviewees() {
    return this.http
      .get<IUserData>(environment.apiUrl + "/User/GetAllInterviewees")
      .pipe(
        catchError(this.errorHandler),
        tap((responseData) => {
          console.log("responseData: ");
          console.log(responseData);
        })
      );
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
