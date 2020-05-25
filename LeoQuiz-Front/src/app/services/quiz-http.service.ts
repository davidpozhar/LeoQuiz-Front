import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { GlobalErrors } from '../classes/error';
import { IQuizData, IQuizViewData } from '../interfaces/quiz-data';

@Injectable()
export class QuizService {
  apiUrl: string = environment.apiUrl + "/Quiz";

  constructor(private http: HttpClient) {}

  getQuizList() {
    return this.http
      .get<Array<IQuizData>>(
        this.apiUrl +
          "GetAll"
      )
      .pipe(catchError(this.errorHandling));
  }

  getQuiz(id: number) {
    return this.http
      .get<IQuizData>(this.apiUrl + "/GetQuizById/" + id)
      .pipe(catchError(this.errorHandling));
  }

  getQuizView(id: number) {
    return this.http
      .get<IQuizData>(this.apiUrl + "/GetQuizViewById/" + id)
      .pipe(catchError(this.errorHandling));
  }

  setNewQuiz(quiz: IQuizData) {
    return this.http
      .post<IQuizData>(this.apiUrl + "/PostQuiz", quiz)
      .pipe(catchError(this.errorHandling));
  }

  updateQuiz(quiz: IQuizData) {
    return this.http
      .put<IQuizData>(this.apiUrl + "/PutQuiz", quiz)
      .pipe(catchError(this.errorHandling));
  }

  deleteQuiz(quiz: IQuizData) {
    return this.http
      .delete(this.apiUrl + "/DeleteQuiz/" + quiz.id)
      .pipe(catchError(this.errorHandling));
  }


  private errorHandling(errorResponse: HttpErrorResponse) {
    if (
      errorResponse.name !== undefined &&
      errorResponse.name === GlobalErrors.undefinedError
    ) {
      return throwError({
        name: errorResponse.name,
        message: errorResponse.message
      });
    }
    return throwError(errorResponse.message);
  }
}