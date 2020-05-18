import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
//import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  roleId: number;
  name: string;
  userEmail: string;

  constructor(
    private signInUp: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.name =
      JSON.parse(localStorage.getItem("userData")).firstName +
      " " +
      JSON.parse(localStorage.getItem("userData")).secondName;
      this.userEmail = JSON.parse(localStorage.getItem("userData")).email;
  }

  onLogout() {
    this.signInUp.logout();
  }

  // private openErrorResponseDialog(errorName: string) {
  //   const dialogRef = this.dialog.open(ErrorResponseDialogComponent, {
  //     width: "fit-content",
  //     data: errorName
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log("The dialog was closed");
  //   });
  // }
}