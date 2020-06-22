import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "LeoQuiz";

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("Init");
    this.authService.autoLogin();
  }

  ngOnDestroy(): void {
    this.authService.logout();
  }
}
