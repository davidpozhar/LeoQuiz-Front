import { Component, OnInit } from "@angular/core";
import { ErrorDialogComponent } from "../../../error-dialog/error-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "src/app/services/user-http.service";
import { IUserData } from "src/app/interfaces/user-data";
import { newArray } from "@angular/compiler/src/util";

@Component({
  selector: "app-interviewee-list",
  templateUrl: "./interviewee-list.component.html",
  styleUrls: ["./interviewee-list.component.scss"],
})
export class IntervieweeListComponent implements OnInit {
  interviewees: Array<IUserData> = [];

  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.interviewees.push({
      id: "24",
      name: "TestUserName",
      surname: "TestUserSurname",
      email: "testemail@gmail.com",
    });
    //this.Get();
  }

  private Get() {
    this.userService.getInterviewees().subscribe(
      (responseData) => {
        console.log("getInterviewees-end");
        this.interviewees = responseData;
      },
      (errorData) => {
        console.log(errorData);
        this.openErrorResponseDialog(errorData.message);
      }
    );
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
