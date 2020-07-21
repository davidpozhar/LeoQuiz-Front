import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { MainResponseComponent } from "./components/main-response/main-response.component";
import { RegistrationFormComponent } from "./components/auth/registration-form/registration-form.component";
import { AuthService } from "./services/auth.service";
import { QuestionService } from "./services/question-http.service";
import { QuizService } from "./services/quiz-http.service";
import { PassQuizService } from "./services/passed-quiz-http.service";
import { AnswerService } from "./services/answer-http.service";
import { SignInUpValidator } from "./validators/sign-in-up.validator";
import { LoginFormComponent } from "./components/auth/login-form/login-form.component";
import { WelcomePageComponent } from "./components/welcome-page/welcome-page.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { HomeComponent } from "./components/home/home.component";
import { HttpAuthInterceptor } from "src/app/classes/http-auth-interceptor";
import { QuizListComponent } from "./components/home/admin/quiz-list/quiz-list.component";
import { ErrorDialogComponent } from "./components/error-dialog/error-dialog.component";
import { QuestionComponent } from "./components/home/admin/question/question.component";
import { QuizComponent } from "./components/home/admin/quiz/quiz.component";
import { PassQuizComponent } from "./components/home/interviewee/pass-quiz/pass-quiz.component";
import { IntervieweeListComponent } from "../app/components/home/admin/interviewee-list/interviewee-list.component";
import { UserService } from "./services/user-http.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainResponseComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    WelcomePageComponent,
    HomeComponent,
    ErrorDialogComponent,
    QuestionComponent,
    QuizListComponent,
    QuizComponent,
    PassQuizComponent,
    IntervieweeListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ScrollingModule,
    AppRoutingModule,
    MatDialogModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  entryComponents: [ErrorDialogComponent],
  providers: [
    AuthService,
    UserService,
    SignInUpValidator,
    QuizService,
    PassQuizService,
    AnswerService,
    QuestionService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true,
    },
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
