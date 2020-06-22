import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { throwError } from "rxjs";
import { GlobalErrors } from "../classes/error";
import { IQuestionData } from "../interfaces/question-data";

@Injectable()
export class QuestionService {
  apiUrl: string = environment.apiUrl + "/Question";

  constructor(private http: HttpClient) {}

  getQuestionList() {
    return this.http
      .get<Array<IQuestionData>>(this.apiUrl)
      .pipe(catchError(this.errorHandling));
  }

  getQuestion(id: number) {
    return this.http
      .get<IQuestionData>(this.apiUrl + "/" + id)
      .pipe(catchError(this.errorHandling));
  }

  setNewQuestion(question: IQuestionData) {
    return this.http
      .post<IQuestionData>(this.apiUrl, question)
      .pipe(catchError(this.errorHandling));
  }

  updateQuestion(question: IQuestionData) {
    return this.http
      .put<IQuestionData>(this.apiUrl, question)
      .pipe(catchError(this.errorHandling));
  }

  deleteQuestion(id: number) {
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
