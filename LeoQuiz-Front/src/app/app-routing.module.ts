import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WelcomePageComponent } from "./components/welcome-page/welcome-page.component";
import { LoginFormComponent } from "./components/auth/login-form/login-form.component";
import { RegistrationFormComponent } from "./components/auth/registration-form/registration-form.component";
import { QuizListComponent } from "./components/home/admin/quiz-list/quiz-list.component";
import { HomeComponent } from "./components/home/home.component";
import { AuthGuard } from "./services/auth.guard";
import { QuizComponent } from "./components/home/admin/quiz/quiz.component";
import { QuestionComponent } from "./components/home/admin/question/question.component";
import { PassQuizComponent } from "./components/home/interviewee/pass-quiz/pass-quiz.component";
import { IntervieweeListComponent } from "./components/home/admin/interviewee-list/interviewee-list.component";

const appRoutes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "login", component: LoginFormComponent },
  { path: "registration", component: RegistrationFormComponent },
  { path: "passquiz/:id", component: PassQuizComponent },

  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "quizlist",
        component: QuizListComponent,
      },
      {
        path: "intervieweelist",
        component: IntervieweeListComponent,
      },
      {
        path: "question/:quizId",
        component: QuestionComponent,
      },
      {
        path: "question",
        component: QuestionComponent,
      },
      {
        path: "question/:quizId/:id",
        component: QuestionComponent,
      },

      { path: "quiz", component: QuizComponent },

      { path: "quiz/:id", component: QuizComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
