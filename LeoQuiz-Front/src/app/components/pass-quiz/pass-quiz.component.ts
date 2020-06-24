import { Component, OnInit, Type } from "@angular/core";
import { IQuizViewData, IPassedQuizData } from "src/app/interfaces/quiz-data";
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { QuizService } from "src/app/services/quiz-http.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ICustomTimeLimit } from "src/app/interfaces/time-limit";
import {
  IQuestionViewData,
  IQuestionPassedData,
} from "src/app/interfaces/question-data";
import { PassQuizService } from "src/app/services/passed-quiz-http.service";

@Component({
  selector: "app-pass-quiz",
  templateUrl: "./pass-quiz.component.html",
  styleUrls: ["./pass-quiz.component.scss"],
})
export class PassQuizComponent implements OnInit {
  id: number;
  quiz: IQuizViewData;
  answers: any;
  passedQuiz: IPassedQuizData = {
    quizId: this.id,
    user: {
      name: "",
      surname: "",
      email: "",
    },
    questions: Array<IQuestionPassedData>(),
  };
  timeLimit: ICustomTimeLimit = { hours: 1, minutes: 0, seconds: 10 };
  interval;

  constructor(
    private dialog: MatDialog,
    private quizService: QuizService,
    private passQuizService: PassQuizService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.id = params["id"];
    });
    console.log(this.id);
    this.getById(this.id);
    this.setTimer();
  }

  getById(id: number) {
    console.log("getbyd");
    this.quizService.getQuizView(id).subscribe(
      (responseData) => {
        console.log(responseData);
        this.quiz = responseData;
        this.passedQuiz.questions = this.quiz.questions;
      },
      (errorData) => {
        if (errorData.name === "HttpErrorResponse") {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  createQuiz(quiz: IQuizViewData) {
    this.passQuizService.setNewQuiz(quiz).subscribe(
      (responseData) => {
        console.log("created");
        console.log(responseData);
      },
      (errorData) => {
        if (errorData.name === "HttpErrorResponse") {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  confirm() {
    console.log(this.passedQuiz);
  }

  setTimer() {
    this.interval = setInterval(() => {
      if (
        this.timeLimit.seconds === 0 &&
        (this.timeLimit.hours > 0 || this.timeLimit.minutes > 0)
      ) {
        this.timeLimit.seconds = 59;
        if (this.timeLimit.minutes > 0) {
          this.timeLimit.minutes--;
        } else if (this.timeLimit.hours > 0) {
          this.timeLimit.hours--;
          this.timeLimit.minutes = 59;
        }
      } else if (
        this.timeLimit.minutes === 0 &&
        this.timeLimit.hours > 0 &&
        this.timeLimit.seconds === 0
      ) {
        this.timeLimit.minutes = 59;
        this.timeLimit.hours--;
      } else if (this.timeLimit.seconds > 0) {
        this.timeLimit.seconds--;
      } else {
        clearInterval(this.interval);
        alert("Stop!");
        this.confirm();
      }
    }, 1000);
  }

  checkAnswers(question: IQuestionViewData) {
    let count = 0;
    question.answers.forEach((element) => {
      if (element.isCorrect) {
        count++;
      }
    });
    if (count > 1) {
      return true;
    }
    return false;
  }

  updateTimeType = (part: number) =>
    part.toString().length > 1 ? part : `0${part}`;

  getTimeLimit = (timeLimit: ICustomTimeLimit) =>
    `${this.updateTimeType(timeLimit?.hours)}:${this.updateTimeType(
      timeLimit?.minutes
    )}:${this.updateTimeType(timeLimit?.seconds)}`;

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
