export interface IAnswerData {
  id?: number;
  text?: string;
  isCorrect?: boolean;
}

export interface IAnswerViewData {
  id?: number;
  text?: string;
}

export interface PassedQuizAnswer {
  id?: number;
  text?: string;
  isCorrect?: boolean;
  isChecked?: boolean;
}
