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
import { IQuizData } from "src/app/interfaces/quiz-data";

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
      if (this.id !== undefined) {
        this.get(this.id);
      } else if (this.quizId !== undefined) {
        this.question = {
          text: "",
          quizId: Number(this.quizId),
          answers: Array<IAnswerData>(),
        };
      } else {
        this.question = {
          text: "",
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
    if (question.id != undefined) {
      this,
        this.questionService.updateQuestion(question).subscribe(
          (responseData) => {
            this.question = responseData;
            this.local();
          },
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
        this.question = responseData;
        this.local();
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
    } else if (this.quizId !== undefined) {
      this.createQuestion(this.question);
    } else {
      this.local();
    }
    this.location.back();
  }

  addAnswer() {
    this.question.answers.push({ isCorrect: false });
    console.log(this.question);
  }

  local() {
    let questionList = JSON.parse(localStorage.getItem("questionList"));
    if (questionList === null) {
      let questionList = Array<IQuestionData>();
      questionList.push(this.question);
    } else if (questionList.find((element) => element.id == this.question.id)) {
      questionList[
        questionList.findIndex((el) => el.id === this.question.id)
      ] = this.question.id;
    } else {
      questionList.push(this.question);
    }
    localStorage.setItem("questionList", JSON.stringify(questionList));
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
    let q = this.question.answers.find((x) => x.id === id).isCorrect;
    this.question.answers.find((x) => x.id === id).isCorrect = !q;
    console.log(this.question);
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
