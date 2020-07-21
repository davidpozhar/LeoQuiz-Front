export interface IAnswerData {
  id?: number;
  text?: string;
  isCorrect?: boolean;
}

export interface IAnswerViewData {
  id?: number;
  questionId: number;
  text?: string;
}

export interface IPassedQuizAnswer {
  id?: number;
  text?: string;
  questionId: number;
  isChecked?: boolean;
}
