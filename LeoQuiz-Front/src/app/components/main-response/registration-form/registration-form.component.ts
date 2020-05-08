import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IUserData } from "../../../interfaces/user-data";
import { SignInUpService } from "src/app/services/sign-in-up.service";
import { SignInUpValidator } from "src/app/validators/sign-in-up.validator";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-registration-form",
  templateUrl: "./registration-form.component.html",
  styleUrls: ["./registration-form.component.scss"]
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  emailAlreadyRegistered: boolean = false;
  positions: Array<{ userRole: string; positionName: string }> = [
    { userRole: "1", positionName: "Interviewer" },
    { userRole: "2", positionName: "Admin" }
  ];

  constructor(
    private signInUpService: SignInUpService,
    private singInUpValidator: SignInUpValidator,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.registrationForm = new FormGroup({
      userName: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.nameValidator
      ]),
      userSurname: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.surnameValidator
      ]),
      userEmail: new FormControl(null, [
        Validators.required,
        this.singInUpValidator.emailValidator
      ]),
      passwords: new FormGroup(
        {
          userPassword: new FormControl(null, [
            Validators.required,
            this.singInUpValidator.passwordValidator
          ]),
          userConfirmPassword: new FormControl(null, [Validators.required])
        },
        [Validators.required, this.singInUpValidator.matchPasswordsValidator]
      )
    });
  }

  onSubmit() {
    this.removeRedBorders();
    if (this.registrationForm.invalid) {
      return;
    }
    const inputData: IUserData = {
      name: this.registrationForm.get("userName").value,
      surname: this.registrationForm.get("userSurname").value,
      email: this.registrationForm.get("userEmail").value,
      password: this.registrationForm.get("passwords").get("userPassword").value,
      userRole: "2"
    };

    this.signInUpService.signUp(inputData).subscribe(
      responseUserData => {


        // TODO доробити

        this.registrationForm.reset();

        this.router.navigate(["/home"]);
      },
      errorData => {
        console.log(errorData);

        // TODO сюди треба додати обробку помилки, якщо ще щось сталось, хоча, тут єдиний трабл
        // це як раз або ВЖЕ ЗАРЕЄСТРОВАНИЙ емейл, або ж трабл з підключенням до сервака ;)

        if (errorData === "Email is in use.") {
          this.getRedBorderEmailInput();
        } 
      }
    );

    console.log(inputData);
  }

  removeRedBorders() {
    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.remove("red-border");
  }

  getRedBorderEmailInput() {
    this.registrationForm
      .get("userEmail")
      .setErrors({ alreadyRegistered: true });

    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.add("red-border");
  }
}