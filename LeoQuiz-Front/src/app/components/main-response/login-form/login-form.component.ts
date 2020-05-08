import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IUserData } from "../../../interfaces/user-data";
import { SignInUpService } from "src/app/services/sign-in-up.service";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-loginin-form",
  templateUrl: "./loginin-form.component.html",
  styleUrls: ["./loginin-form.component.scss"],
})
export class LoginFormComponent implements OnInit {
  loginInForm: FormGroup;
  error: string = null;

  constructor(
    private signInUpService: SignInUpService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginInForm = new FormGroup({
      userEmail: new FormControl(null, Validators.required),
      userPassword: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    this.removeRedBorders();
    if (this.loginInForm.invalid) {
      return;
    }
    const loginInData: IUserData = {
      email: this.loginInForm.get("userEmail").value,
      password: this.loginInForm.get("userPassword").value,
    };

    console.log("start login in");
    this.signInUpService.singIn(loginInData).subscribe(
      (responseData) => {
        console.log("end");

        this.loginInForm.reset();
        this.router.navigate(["/home"]);
      },
      (errorData) => {
        console.log(errorData);
        if (errorData === "There is no email") {
          this.getRedBorderEmailInput();
        } else if (errorData === "Bad password") {
          this.getRedBorderPasswordInput();
        } 
      }
    );
  }

  removeRedBorders() {
    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.remove("red-border");

    const passwordInput = document.getElementsByName("userPassword")[0];
    passwordInput.classList.remove("red-border");
  }

  getRedBorderEmailInput() {
    this.loginInForm.get("userEmail").setErrors({ doesNotRegistered: true });

    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.add("red-border");
  }

  getRedBorderPasswordInput() {
    this.loginInForm.get("userPassword").setErrors({ incorrectPassword: true });

    const passwordInput = document.getElementsByName("userPassword")[0];
    passwordInput.classList.add("red-border");
  }
}
