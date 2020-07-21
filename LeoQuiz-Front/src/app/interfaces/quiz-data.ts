import { IQuestionData, IQuestionViewData } from "./question-data";
import { IUserData } from "./user-data";
import { IPassedQuizAnswer } from "./answer-data";

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
  timeLimit?: number;
  maxAttempts?: number;
  passGrade?: number;
  quizUrl?: string;
  questions?: Array<IQuestionViewData>;
}

export interface IPassedQuizData {
  id?: number;
  quizId?: number;
  user?: IUserData;
  answers?: Array<IPassedQuizAnswer>;
}

export interface IPassedFullQuizData {
  id?: number;
  grade?: number;
  quizId?: number;
  user?: IUserData;
  answers?: Array<IPassedQuizAnswer>;
}
