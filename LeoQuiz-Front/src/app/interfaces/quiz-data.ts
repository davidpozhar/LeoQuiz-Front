import { Time } from "@angular/common";
import {
  IQuestionData,
  IQuestionViewData,
  IQuestionPassedData,
} from "./question-data";
import { IUserData } from "./user-data";
import { PassedQuizAnswer } from "./answer-data";
import { ICustomTimeLimit } from "./time-limit";

export interface IQuizData {
  id?: number;
  name?: string;
  timeLimit?: any;
  maxAttempts?: number;
  passGrade?: number;
  quizUrl?: string;
  questions?: Array<IQuestionData>;
}

export interface IQuizViewData {
  id?: number;
  name?: string;
  timeLimit?: ICustomTimeLimit;
  maxAttempts?: number;
  passGrade?: number;
  quizUrl?: string;
  questions?: Array<IQuestionViewData>;
}

export interface IPassedQuizData {
  id?: number;
  grade?: number;
  quizId?: number;
  user?: IUserData;
  questions?: Array<IQuestionPassedData>;
}
