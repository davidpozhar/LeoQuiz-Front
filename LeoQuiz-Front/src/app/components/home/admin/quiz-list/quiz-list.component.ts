import { Component, OnInit } from "@angular/core";
import { IQuizData } from "src/app/interfaces/quiz-data";
import { ErrorDialogComponent } from "../../../error-dialog/error-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { QuizService } from "src/app/services/quiz-http.service";
import { GlobalErrors } from "src/app/classes/error";

@Component({
  selector: "app-quiz-list",
  templateUrl: "./quiz-list.component.html",
  styleUrls: ["./quiz-list.component.scss"],
})
export class QuizListComponent implements OnInit {
  quizzes: Array<IQuizData>;

  constructor(private dialog: MatDialog, private quizService: QuizService) {}

  ngOnInit(): void {
    this.Get();
  }

  private Get() {
    this.quizService.getQuizList().subscribe(
      (responseData) => {
        console.log(responseData);
        this.quizzes = responseData;
        localStorage.setItem("quizzList", JSON.stringify(this.quizzes));
      },
      (errorData) => {
        if (errorData.name === "HttpErrorResponse") {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  Delete(id: number) {
    console.log(id);
    if (id !== undefined) {
      this.quizService.deleteQuiz(id).subscribe(
        (_responseData) => {
          this.quizzes = this.quizzes.filter((item) => item.id !== id);
        },
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
