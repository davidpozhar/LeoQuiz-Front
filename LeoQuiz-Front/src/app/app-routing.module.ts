import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WelcomePageComponent } from "./components/main-response/welcome-page/welcome-page.component";
import { LoginFormComponent } from "./components/main-response/login-form/login-form.component";
import { RegistrationFormComponent } from "./components/main-response/registration-form/registration-form.component";
import { QuizListComponent } from "./components/main-response/home/quiz-list/quiz-list.component";
import { HomeComponent } from "./components/main-response/home/home.component";
import { AuthGuard, QuizListGuard } from "./services/auth.guard";

const appRoutes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "login", component: LoginFormComponent },
  { path: "registration", component: RegistrationFormComponent },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "quizlist",
      component: QuizListComponent,
      canActivate: [AuthGuard]
    }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}