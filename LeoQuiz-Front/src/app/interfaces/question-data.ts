import { IAnswerData } from "./answer-data";
import { AnswerType } from "../classes/answer-type";

export interface IQuestionData {
  id?: number;
  text?: string;
  quizId?: number;
  answers?: Array<IAnswerData>;
}

export interface IQuestionViewData {
  id?: number;
  text?: string;
  type: number;
  maxAttempts?: number;
  answers?: Array<IAnswerData>;
}
