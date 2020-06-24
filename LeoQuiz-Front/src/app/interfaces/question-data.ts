import { Time } from "@angular/common";
import { IAnswerViewData, IAnswerData, PassedQuizAnswer } from "./answer-data";

export interface IQuestionData {
  id?: number;
  text?: string;
  timeLimit?: any;
  quizId?: number;
  answers?: Array<IAnswerData>;
}

export interface IQuestionViewData {
  id?: number;
  text?: string;
  maxAttempts?: number;
  answers?: Array<IAnswerData>;
}

export interface IQuestionPassedData {
  id?: number;
  text?: string;
  maxAttempts?: number;
  answers?: Array<PassedQuizAnswer>;
}
