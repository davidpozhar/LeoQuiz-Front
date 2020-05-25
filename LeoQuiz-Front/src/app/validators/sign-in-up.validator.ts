import { FormControl, FormGroup } from "@angular/forms";

export class SignInUpValidator {
  nameValidator(control: FormControl): { [key: string]: boolean } {
    if (control !== undefined) {
      let name: string = control.value;

      if (name !== null) {
        name = name.trim();
        const regex: RegExp = /^[A-Z][a-z]{0,}$/;
        const isContains = regex.test(name);
        if (isContains) {
          document
            .getElementsByName("userName")[0]
            .classList.remove("red-border");

          return null;
        }
        document.getElementsByName("userName")[0].classList.add("red-border");

        return { incorrectName: true };
      }
    }
  }

  surnameValidator(control: FormControl): { [key: string]: boolean } {
    if (control !== null) {
      let surname: string = control.value;

      if (surname !== null) {
        surname = surname.trim();
        const regex: RegExp = /^[A-Z][a-z]{0,}$/;
        const isContains = regex.test(surname);
        if (isContains) {
          document
            .getElementsByName("userSurname")[0]
            .classList.remove("red-border");

          return null;
        }
        document
          .getElementsByName("userSurname")[0]
          .classList.add("red-border");

        return { incorrectSurname: true };
      }
    }
  }

  emailValidator(control: FormControl): { [key: string]: boolean } {
    if (control !== null) {
      let email: string = control.value;

      if (email !== null) {
        email = email.trim().toLowerCase();
        const regex: RegExp = /^[a-zA-Z](([^=+&#$%!<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]#!\.,;:\s@\"]{2,})$/i;
        const isContains = regex.test(email);
        if (isContains) {
          document
            .getElementsByName("userEmail")[0]
            .classList.remove("red-border");

          return null;
        }
        document.getElementsByName("userEmail")[0].classList.add("red-border");

        return { incorrectEmail: true };
      }
    }
  }

  passwordValidator(control: FormControl): { [key: string]: boolean } {
    if (control !== null) {
      let password: string = control.value;

      if (password !== null) {
        password = password.trim();
        const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        const isContains = regex.test(password);
        if (isContains) {
          document
            .getElementsByName("userPassword")[0]
            .classList.remove("red-border");

          return null;
        }
        document
          .getElementsByName("userPassword")[0]
          .classList.add("red-border");

        return { doesNotStrongPassword: true };
      }
    }
  }

  matchPasswordsValidator(group: FormGroup): { [key: string]: boolean } {
    const password: string = group.value.userPassword;
    const confirmPassword: string = group.value.userConfirmPassword;

    if (password !== null) {
      if (confirmPassword !== null && confirmPassword.length > 0) {
        if (password !== confirmPassword) {
          document
            .getElementsByName("userConfirmPassword")[0]
            .classList.add("red-border");

          return { passwordsDoNotMatch: true };
        }
        document
          .getElementsByName("userConfirmPassword")[0]
          .classList.remove("red-border");

        return null;
      }
      document
        .getElementsByName("userConfirmPassword")[0]
        .classList.remove("red-border");
      return null;
    }
    return null;
  }
}
