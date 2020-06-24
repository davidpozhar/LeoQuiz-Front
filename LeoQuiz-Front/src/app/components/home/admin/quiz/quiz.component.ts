import { Component, OnInit, Type } from "@angular/core";
import { IQuizData } from "src/app/interfaces/quiz-data";
import { ErrorDialogComponent } from "../../../error-dialog/error-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { QuizService } from "src/app/services/quiz-http.service";
import { GlobalErrors } from "src/app/classes/error";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ITimeLimit } from "src/app/interfaces/time-limit";
import { QuestionService } from "src/app/services/question-http.service";
import { IQuestionData } from "src/app/interfaces/question-data";

type TimePart = "hour" | "minute";

@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.scss"],
})
export class QuizComponent implements OnInit {
  id: number;
  quiz: IQuizData;

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
      console.log(this.id);
      if (this.id !== undefined) {
        this.getById(this.id);
      } else {
        this.quiz = {
          name: "",
          timeLimit: { hours: 0, minutes: 10 },
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
        console.log(responseData);
        this.quiz = responseData;
        this.quiz.timeLimit.hours = 0;
        this.quiz.timeLimit.minutes = 10;
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
    `${this.updateTimeType(timeLimit?.hours)}:${this.updateTimeType(
      timeLimit?.minutes
    )}`;

  update(quiz: IQuizData) {
    if (quiz.id != undefined) {
      this,
        this.quizService.updateQuiz(quiz).subscribe(
          (responseData) => {
            console.log("updated");
            console.log(responseData);
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
        console.log("created");
        console.log(responseData);
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
    console.log("confirm");
    console.log(this.quiz);
    if (this.id !== undefined) {
      this.update(this.quiz);
    } else {
      this.createQuiz(this.quiz);
    }
    localStorage.removeItem("questionList");
    localStorage.removeItem("quiz");
  }

  updateQuestionRedirect(id: number) {
    console.log("updateredirect");
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
    console.log("updateredirect");
    if (this.quiz.id !== undefined) {
      this.router.navigate(["/home/question/" + this.quiz.id.toString()]);
    } else {
      this.router.navigate(["/home/question"]);
    }
  }

  deleteQuestion(id: number) {
    console.log(id);
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

    if (type === "hour") {
      if (value < 0) {
        this.quiz.timeLimit.hours = 0;
      } else {
        this.quiz.timeLimit.hours = value;
      }
    } else if (type === "minute") {
      if (value < 0) {
        this.quiz.timeLimit.minutes = 0;
      } else if (value > 60) {
        this.quiz.timeLimit.minutes = 60;
      } else {
        this.quiz.timeLimit.minutes = value;
      }
    }
    console.log(this.quiz);
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
