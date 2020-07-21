import { Component, OnInit, Type } from "@angular/core";
import { IQuizData } from "src/app/interfaces/quiz-data";
import { ErrorDialogComponent } from "../../../error-dialog/error-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { QuizService } from "src/app/services/quiz-http.service";
import { GlobalErrors } from "src/app/classes/error";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ITimeLimit, ICustomTimeLimit } from "src/app/interfaces/time-limit";
import { QuestionService } from "src/app/services/question-http.service";
import { IQuestionData } from "src/app/interfaces/question-data";

type TimePart = "minute" | "second";

@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.scss"],
})
export class QuizComponent implements OnInit {
  id: number;
  quiz: IQuizData;
  quizTime: ICustomTimeLimit = { minutes: 0, seconds: 0 };

  constructor(
    private dialog: MatDialog,
    private quizService: QuizService,
    private questionService: QuestionService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.id = params["id"];
      if (this.id !== undefined) {
        this.getById(this.id);
      } else {
        this.quiz = {
          name: "",
          timeLimit: 0,
          maxAttempts: 0,
          passGrade: 0,
          quizUrl: "",
          questions: Array<IQuestionData>(),
        };
        if (JSON.parse(localStorage.getItem("quiz")) !== null) {
          this.quiz = this.quiz.questions = JSON.parse(
            localStorage.getItem("quiz")
          );
        }
        if (JSON.parse(localStorage.getItem("questionList")) !== null) {
          this.quiz.questions = JSON.parse(
            localStorage.getItem("questionList")
          );
          localStorage.setItem("quiz", JSON.stringify(this.quiz));
        }
      }
    });
  }

  getById(id: number) {
    this.quizService.getQuiz(id).subscribe(
      (responseData) => {
        this.quiz = responseData;
        this.quizTime.minutes = Math.floor(this.quiz.timeLimit / 60);
        this.quizTime.seconds = this.quiz.timeLimit % 60;
        localStorage.setItem("quiz", JSON.stringify(this.quiz));
        localStorage.setItem(
          "questionList",
          JSON.stringify(this.quiz.questions)
        );
      },
      (errorData) => {
        if (errorData.name === "HttpErrorResponse") {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  updateTimeType = (part: number) =>
    part.toString().length > 1 ? part : `0${part}`;

  getTimeLimit = (timeLimit: ITimeLimit) =>
    `${this.updateTimeType(timeLimit?.minutes)}:${this.updateTimeType(
      timeLimit?.seconds
    )}`;

  update(quiz: IQuizData) {
    if (quiz.id != undefined) {
      this,
        this.quizService.updateQuiz(quiz).subscribe(
          (responseData) => {
            this.router.navigate(["/home/quizlist"]);
          },
          (errorData) => {
            if (errorData.name === GlobalErrors.undefinedError) {
              this.openErrorResponseDialog(errorData.message);
            }
          }
        );
    }
  }

  createQuiz(quiz: IQuizData) {
    quiz.questions.forEach((element) => {});
    this.quizService.setNewQuiz(quiz).subscribe(
      (responseData) => {
        this.router.navigate(["/home/quizlist"]);
      },
      (errorData) => {
        if (errorData.name === "HttpErrorResponse") {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  confirm() {
    if (this.id !== undefined) {
      this.update(this.quiz);
    } else {
      this.createQuiz(this.quiz);
    }
    localStorage.removeItem("questionList");
    localStorage.removeItem("quiz");
  }

  updateQuestionRedirect(id: number) {
    if (this.quiz.id !== undefined) {
      this.router.navigate([
        "/home/question/" + this.quiz.id.toString() + "/" + id.toString(),
      ]);
    } else {
      this.router.navigate(["/home/question"]);
    }
  }

  newQuestionRedirect() {
    localStorage.setItem("quiz", JSON.stringify(this.quiz));
    localStorage.setItem("questionList", JSON.stringify(this.quiz.questions));
    if (this.quiz.id !== undefined) {
      this.router.navigate(["/home/question/" + this.quiz.id.toString()]);
    } else {
      this.router.navigate(["/home/question"]);
    }
  }

  deleteQuestion(id: number) {
    if (id !== undefined) {
      this.questionService.deleteQuestion(id).subscribe(
        (_responseData) => {
          this.quiz.questions = this.quiz.questions.filter(
            (item) => item.id !== id
          );
        },
        (errorData) => {
          if (errorData.name === GlobalErrors.undefinedError) {
            this.openErrorResponseDialog(errorData.message);
          }
        }
      );
    }
  }

  onTimeLimitChange(event: any, type: TimePart) {
    const value = Number(event.target.value);

    if (type === "minute") {
      if (value < 0) {
        this.quizTime.minutes = 0;
      } else if (value > 60) {
        this.quizTime.minutes = 60;
      } else {
        this.quizTime.minutes = value;
      }
    } else if (type === "second") {
      if (value < 0) {
        this.quizTime.seconds = 0;
      } else if (value > 59) {
        this.quizTime.minutes++;
        this.quizTime.seconds = 0;
      } else {
        this.quizTime.seconds = value;
      }
    }

    this.quiz.timeLimit = this.quizTime.minutes * 60 + this.quizTime.seconds;
  }

  onPassGradeChange() {
    if (this.quiz.passGrade > 100) {
      this.quiz.passGrade = 100;
    } else if (this.quiz.passGrade < 0) {
      this.quiz.passGrade = 0;
    }
  }

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
