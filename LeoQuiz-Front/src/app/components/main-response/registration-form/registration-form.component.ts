import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IUserData } from "../../../interfaces/user-data";
import { AuthService } from "src/app/services/auth.service";
import { SignInUpValidator } from "src/app/validators/sign-in-up.validator";
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
    private authService: AuthService,
    private singInUpValidator: SignInUpValidator,
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

    this.authService.signUp(inputData).subscribe(
      responseUserData => {



        this.registrationForm.reset();

        this.router.navigate(["/home"]);
      },
      errorData => {
        console.log(errorData);

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