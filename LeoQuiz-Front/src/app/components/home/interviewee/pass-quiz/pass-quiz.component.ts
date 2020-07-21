import { Component, OnInit, Type } from "@angular/core";
import { IQuizViewData, IPassedQuizData } from "src/app/interfaces/quiz-data";
import { ErrorDialogComponent } from "src/app/components/error-dialog/error-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { QuizService } from "src/app/services/quiz-http.service";
import { ActivatedRoute } from "@angular/router";
import { ICustomTimeLimit } from "src/app/interfaces/time-limit";
import { PassQuizService } from "src/app/services/passed-quiz-http.service";
import {
  IPassedQuizAnswer,
  IAnswerViewData,
} from "src/app/interfaces/answer-data";

@Component({
  selector: "app-pass-quiz",
  templateUrl: "./pass-quiz.component.html",
  styleUrls: ["./pass-quiz.component.scss"],
})
export class PassQuizComponent implements OnInit {
  id: number;
  quiz: IQuizViewData;
  quizTime: ICustomTimeLimit = { minutes: 0, seconds: 0 };
  passedQuiz: IPassedQuizData = {
    quizId: this.id,
    user: {
      name: "",
      surname: "",
      email: "",
    },
    answers: Array<IPassedQuizAnswer>(),
  };
  timeLimit: ICustomTimeLimit = { minutes: 0, seconds: 0 };
  interval;

  constructor(
    private dialog: MatDialog,
    private quizService: QuizService,
    private passQuizService: PassQuizService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.id = params["id"];
    });
    this.getById(this.id);
    this.setTimer();
  }

  getById(id: number) {
    this.quizService.getQuizView(id).subscribe(
      (responseData) => {
        this.quiz = responseData;
        this.timeLimit.minutes = Math.floor(this.quiz.timeLimit / 60);
        this.timeLimit.seconds = this.quiz.timeLimit % 60;
      },
      (errorData) => {
        if (errorData.name === "HttpErrorResponse") {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  createQuiz(quiz: IPassedQuizData) {
    this.passQuizService.setNewQuiz(quiz).subscribe(
      (responseData) => {},
      (errorData) => {
        if (errorData.name === "HttpErrorResponse") {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  confirm() {
    this.passedQuiz.quizId = this.id;
    this.createQuiz(this.passedQuiz);
  }

  setTimer() {
    this.interval = setInterval(() => {
      if (this.timeLimit.seconds === 0 && this.timeLimit.minutes > 0) {
        this.timeLimit.seconds = 59;
        if (this.timeLimit.minutes > 0) {
          this.timeLimit.minutes--;
        }
      } else if (this.timeLimit.seconds > 0) {
        this.timeLimit.seconds--;
      } else {
        clearInterval(this.interval);
        alert("Stop!");
        this.confirm();
      }
    }, 1000);
  }

  checkAnswers(questionId: number) {
    switch (this.quiz.questions.find((q) => q.id == questionId).type) {
      case 1:
        return true;
      case 0:
        return false;
    }
  }

  changeAnswers(event: any, answer: IAnswerViewData) {
    var found = this.passedQuiz.answers.some((el) => {
      return el.id === answer.id;
    });
    if (!found) {
      this.passedQuiz.answers.push(answer);
      // if (this.quiz.questions.find((q) => q.id == answer.id).type != 1) {
      this.passedQuiz.answers.forEach((element) => {
        if (
          element.questionId == answer.questionId &&
          element.id != answer.id
        ) {
          this.passedQuiz.answers.splice(element.id, 1);
        }
      });
      //}
    } else {
      this.passedQuiz.answers.splice(answer.id, 1);
    }
  }

  updateTimeType = (part: number) =>
    part.toString().length > 1 ? part : `0${part}`;

  getTimeLimit = (timeLimit: ICustomTimeLimit) =>
    `${this.updateTimeType(timeLimit?.minutes)}:${this.updateTimeType(
      timeLimit?.seconds
    )}`;

  private openErrorResponseDialog(errorName: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: "fit-content",
      data: errorName,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }
}
