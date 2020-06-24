import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { throwError } from "rxjs";
import { GlobalErrors } from "../classes/error";
import { IQuizData, IQuizViewData } from "../interfaces/quiz-data";

@Injectable()
export class PassQuizService {
  apiUrl: string = environment.apiUrl + "/PassedQuiz";

  constructor(private http: HttpClient) {}

  getQuizList() {
    return this.http
      .get<Array<IQuizData>>(this.apiUrl + "/GetAll")
      .pipe(catchError(this.errorHandling));
  }

  getQuiz(id: number) {
    return this.http
      .get<IQuizData>(this.apiUrl + "/GetPassedQuizById/" + id)
      .pipe(catchError(this.errorHandling));
  }

  setNewQuiz(quiz: IQuizData) {
    console.log(quiz);
    return this.http
      .post<IQuizData>(this.apiUrl + "/PostPassedQuiz", quiz)
      .pipe(catchError(this.errorHandling));
  }

  deleteQuiz(id: number) {
    console.log(id);

    return this.http
      .delete(this.apiUrl + "/DeletePassedQuiz/" + id)
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
