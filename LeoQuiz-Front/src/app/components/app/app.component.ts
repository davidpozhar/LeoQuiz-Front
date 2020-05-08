import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SignInUpService } from 'src/app/services/sign-in-up.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "LeoQuiz";

  constructor(
    private signInUpService: SignInUpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.signInUpService.autoLogin;
  }

  ngOnDestroy(): void {
    this.signInUpService.logout;
  }
}
