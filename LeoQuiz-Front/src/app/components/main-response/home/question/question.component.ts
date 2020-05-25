import { Component, OnInit } from "@angular/core";
import { IQuestionData } from "src/app/interfaces/question-data";
import { MatDialog } from "@angular/material/dialog";
import { QuestionService } from "src/app/services/question-http.service";
import { GlobalErrors } from 'src/app/classes/error';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';

@Component({
  selector: "app-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
})
export class QuestionComponent implements OnInit {
  question: IQuestionData;
  id: number;

  constructor(
    private dialog: MatDialog,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.Get(this.id);
  }

  private Get(id: number) {
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

  Update(question: IQuestionData) {
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

  Delete(question: IQuestionData) {
    if (question.id !== undefined) {
      this.questionService.deleteQuestion(question).subscribe(
        (responseData) => {},
        (errorData) => {
          if (errorData.name === GlobalErrors.undefinedError) {
            this.openErrorResponseDialog(errorData.message);
          }
        }
      );
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
