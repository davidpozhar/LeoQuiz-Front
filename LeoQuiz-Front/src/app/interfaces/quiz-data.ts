import { Time } from "@angular/common";
import { IQuestionData, IQuestionViewData } from "./question-data";

export interface IQuizData {
  id?: number;
  name?: string;
  timeLimit?: any;
  maxAttempts?: number;
  passGrade?: number;
  quizUrl?: string;
  //userId?: number;                            ЮЗЕРІД ВСТАВЛЯТИ НА БЕКЕНДІ ЧЕРЕЗ КЛЕЙМИ НЕ ЗАБУДЬ ДОБАВИТИ
  questions?: Array<IQuestionData>;
}

export interface IQuizViewData {
  id?: number;
  name?: string;
  timeLimit?: Time;
  maxAttempts?: number;
  passGrade?: number;
  quizUrl?: string;
  questions?: Array<IQuestionViewData>;
}
