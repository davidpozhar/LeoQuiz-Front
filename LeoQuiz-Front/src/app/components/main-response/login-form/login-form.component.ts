import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IUserData } from "../../../interfaces/user-data";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  error: string = null;

  constructor(
    private signInUpService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      userEmail: new FormControl(null, Validators.required),
      userPassword: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    this.removeRedBorders();
    if (this.loginForm.invalid) {
      return;
    }
    const loginData: IUserData = {
      email: this.loginForm.get("userEmail").value,
      password: this.loginForm.get("userPassword").value,
    };

    console.log("start login in");
    this.signInUpService.singIn(loginData).subscribe(
      (responseData) => {
        console.log("end");

        this.loginForm.reset();
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
    this.loginForm.get("userEmail").setErrors({ doesNotRegistered: true });

    const emailInput = document.getElementsByName("userEmail")[0];
    emailInput.classList.add("red-border");
  }

  getRedBorderPasswordInput() {
    this.loginForm.get("userPassword").setErrors({ incorrectPassword: true });

    const passwordInput = document.getElementsByName("userPassword")[0];
    passwordInput.classList.add("red-border");
  }
}
