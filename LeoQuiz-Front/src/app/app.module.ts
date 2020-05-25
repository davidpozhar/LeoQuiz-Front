import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./components/app/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { MainResponseComponent } from "./components/main-response/main-response.component";
import { RegistrationFormComponent } from "./components/main-response/registration-form/registration-form.component";
import { AuthService } from "./services/auth.service";
import { QuestionService } from "./services/question-http.service";
import { QuizService } from "./services/quiz-http.service";
import { SignInUpValidator } from "./validators/sign-in-up.validator";
import { LoginFormComponent } from "./components/main-response/login-form/login-form.component";
import { WelcomePageComponent } from "./components/main-response/welcome-page/welcome-page.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { HomeComponent } from "./components/main-response/home/home.component";
import { HttpAuthInterceptor } from "src/app/classes/http-auth-interceptor";
import { QuizListComponent } from "./components/main-response/home/quiz-list/quiz-list.component";
import { ErrorDialogComponent } from "./components/main-response/error-dialog/error-dialog.component";
import { QuestionComponent } from './components/main-response/home/question/question.component';

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
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ScrollingModule,
    AppRoutingModule,
    MatDialogModule
  ],
  entryComponents: [ErrorDialogComponent],
  providers: [
    AuthService,
    SignInUpValidator,
    QuizService,
    QuestionService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true,
    },
    JwtHelperService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
