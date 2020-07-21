import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { IUserData } from "../interfaces/user-data";
import { environment } from "../../environments/environment";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getInterviewees() {
    return this.http
      .get<Array<IUserData>>(environment.apiUrl + "/User/GetAllInterviewees")
      .pipe(
        catchError(this.errorHandler),
        tap((responseData) => {})
      );
  }

  private errorHandler(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);
    return throwError({
      name: errorResponse.name,
      message: errorResponse.message,
    });
  }
}
