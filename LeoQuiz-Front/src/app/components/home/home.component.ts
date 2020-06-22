import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from "@angular/material/dialog";
import { AuthErrors } from 'src/app/classes/error';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  roleId: number;
  name: string;
  userEmail: string;
  dialog: MatDialog;
  authError: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    this.name =
      JSON.parse(localStorage.getItem("userData")).name +
      " " +
      JSON.parse(localStorage.getItem("userData")).surname;
      this.userEmail = JSON.parse(localStorage.getItem("userData")).email;
  }

  onLogout() {
    this.authService.logout();
  }

  private openErrorResponseDialog(errorName: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: "fit-content",
      data: errorName
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}