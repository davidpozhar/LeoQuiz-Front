import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IUserData } from "../../../interfaces/user-data";
import { AuthService } from "src/app/services/auth.service";
import { SignInUpValidator } from "src/app/validators/sign-in-up.validator";
import { Router } from "@angular/router";
import { AuthErrors } from "src/app/classes/error";
import { MatDialog } from "@angular/material/dialog";
import { ErrorDialogComponent } from "../../error-dialog/error-dialog.component";

@Component({
  selector: "app-registration-form",
  templateUrl: "./registration-form.component.html",
  styleUrls: ["./registration-form.component.scss"],
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  emailAlreadyRegistered: boolean = false;

  ErrorType = AuthErrors;
  authError: string = "";

  positions: Array<{ userRole: string; positionName: string }> = [
    { userRole: "1", positionName: "Interviewer" },
    { userRole: "2", positionName: "Admin" },
  ];

  constructor(
    private authService: AuthService,
    private singInUpValidator: SignInUpValidator,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.registrationForm = new FormGroup({
      userName: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.nameValidator,
      ]),
      userSurname: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.surnameValidator,
      ]),
      userEmail: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.emailValidator,
      ]),
      passwords: new FormGroup(
        {
          userPassword: new FormControl(null, [
            Validators.required,
            this.singInUpValidator.passwordValidator,
          ]),
          userConfirmPassword: new FormControl(null, [Validators.required]),
        },
        [Validators.required, this.singInUpValidator.matchPasswordsValidator]
      ),
    });
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }
    const inputData: IUserData = {
      name: this.registrationForm.get("userName").value,
      surname: this.registrationForm.get("userSurname").value,
      email: this.registrationForm.get("userEmail").value,
      password: this.registrationForm.get("passwords").get("userPassword")
        .value,
      userRole: 1,
    };

    this.authService.signUp(inputData).subscribe(
      (responseUserData) => {
        this.registrationForm.reset();
        return this.authService.getUserInfo().subscribe(
          (responseData) => {
            console.log("getInfo-end");
            this.router.navigate(["/home"]);
          },
          (errorData) => {
            console.log(errorData);
            this.authError = errorData;
            if (errorData.name === AuthErrors.undefinedError) {
              this.openErrorResponseDialog(errorData.message);
            }
          }
        );
      },
      (errorData) => {
        console.log(errorData);
        this.authError = errorData;
        if (errorData === AuthErrors.undefinedError) {
          this.openErrorResponseDialog(errorData.message);
        }
      }
    );
  }

  openErrorResponseDialog(errorName: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: "fit-content",
      data: errorName,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }
}
