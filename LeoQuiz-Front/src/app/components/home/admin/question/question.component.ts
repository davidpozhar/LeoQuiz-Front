import { Component, OnInit } from "@angular/core";
import { IQuestionData } from "src/app/interfaces/question-data";
import { MatDialog } from "@angular/material/dialog";
import { QuestionService } from "src/app/services/question-http.service";
import { GlobalErrors, AuthErrors } from "src/app/classes/error";
import { ErrorDialogComponent } from "../../../error-dialog/error-dialog.component";
import { ActivatedRoute } from "@angular/router";
import { AnswerService } from "src/app/services/answer-http.service";
import { IAnswerData } from "src/app/interfaces/answer-data";
import { Location } from "@angular/common";
import { Identifiers } from "@angular/compiler";

type TimePart = "hour" | "minute";

@Component({
  selector: "app-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
})
export class QuestionComponent implements OnInit {
  question: IQuestionData;
  id: number;
  quizId: number;
  ErrorType = AuthErrors;
  authError: string = "";

  constructor(
    private dialog: MatDialog,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private activateRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.id = params["id"];
      this.quizId = params["quizId"];
      console.log(this.quizId);
      console.log(this.id);
      if (this.id !== undefined) {
        this.get(this.id);
      } else {
        this.question = {
          text: "",
          timeLimit: {},
          quizId: Number(this.quizId),
          answers: Array<IAnswerData>(),
        };
      }
    });
  }

  private get(id: number) {
    this.questionService.getQuestion(id).subscribe(
      (responseData) => {
        console.log(responseData);
        this.question = responseData;
      },
      (errorData) => {
        if (errorData.name === "HttpErrorResponse") {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  update(question: IQuestionData) {
    //ЗАБРАТИ ВЕЛИКЫ ЛЫТЕРИ
    if (question.id != undefined) {
      this,
        this.questionService.updateQuestion(question).subscribe(
          (responseData) => {},
          (errorData) => {
            if (errorData.name === GlobalErrors.undefinedError) {
              this.openErrorResponseDialog(errorData.message);
            }
          }
        );
    }
  }

  delete(id: number) {
    if (id !== undefined) {
      this.questionService.deleteQuestion(id).subscribe(
        (responseData) => {},
        (errorData) => {
          if (errorData.name === GlobalErrors.undefinedError) {
            this.openErrorResponseDialog(errorData.message);
          }
        }
      );
    }
  }

  createQuestion(question: IQuestionData) {
    this.questionService.setNewQuestion(question).subscribe(
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
    if (this.id !== undefined) {
      this.update(this.question);
    } else {
      this.createQuestion(this.question);
    }
    this.location.back();
  }

  addAnswer() {
    this.question.answers.push({ isCorrest: false });
    console.log(this.question);
  }

  deleteAnswer(id: number) {
    if (id !== undefined) {
      this.answerService.deleteAnswer(id).subscribe(
        (responseData) => {},
        (errorData) => {
          if (errorData.name === GlobalErrors.undefinedError) {
            this.openErrorResponseDialog(errorData.message);
          }
        }
      );
    }
  }

  checkAnswer(id: number) {
    let q = this.question.answers.find((x) => x.id === id).isCorrest;
    this.question.answers.find((x) => x.id === id).isCorrest = !q;
    console.log(this.question);
  }

  onTimeLimitChange(event: any, type: TimePart) {
    const value = Number(event.target.value);

    if (type === "hour") {
      if (value < 0) {
        this.question.timeLimit.hours = 0;
      } else {
        this.question.timeLimit.hours = value;
      }
    } else if (type === "minute") {
      if (value < 0) {
        this.question.timeLimit.minutes = 0;
      } else if (value > 60) {
        this.question.timeLimit.minutes = 60;
      } else {
        this.question.timeLimit.minutes = value;
      }
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
