import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { throwError } from "rxjs";
import { GlobalErrors } from "../classes/error";
import { IAnswerData } from "../interfaces/answer-data";

@Injectable()
export class AnswerService {
  apiUrl: string = environment.apiUrl + "/Answer";

  constructor(private http: HttpClient) {}

  getAnswerList() {
    return this.http
      .get<Array<IAnswerData>>(this.apiUrl)
      .pipe(catchError(this.errorHandling));
  }

  getAnswer(id: number) {
    return this.http
      .get<IAnswerData>(this.apiUrl + "/" + id)
      .pipe(catchError(this.errorHandling));
  }

  setNewAnswer(answer: IAnswerData) {
    return this.http
      .post<IAnswerData>(this.apiUrl, answer)
      .pipe(catchError(this.errorHandling));
  }

  updateAnswer(answer: IAnswerData) {
    return this.http
      .put<IAnswerData>(this.apiUrl, answer)
      .pipe(catchError(this.errorHandling));
  }

  deleteAnswer(id: number) {
    return this.http
      .delete(this.apiUrl + "/" + id)
      .pipe(catchError(this.errorHandling));
  }

  private errorHandling(errorResponse: HttpErrorResponse) {
    if (
      errorResponse.name !== undefined &&
      errorResponse.name === GlobalErrors.undefinedError
    ) {
      return throwError({
        name: errorResponse.name,
        message: errorResponse.message,
      });
    }
    return throwError(errorResponse.message);
  }
}
