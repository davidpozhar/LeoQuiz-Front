import { Time } from '@angular/common';
import { IAnswerViewData, IAnswerData } from './answer-data';

export interface IQuestionData {
    id?: number;
    text?: string;
    timeLimit?: Time;
    maxAttempts?: number;
    answers?: Array<IAnswerData>;
  }

  export interface IQuestionViewData {
    id?: number;
    text?: string;
    timeLimit?: Time;
    maxAttempts?: number;
    answers?: Array<IAnswerViewData>;
  }