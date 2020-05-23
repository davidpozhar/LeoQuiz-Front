import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./components/app/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { MainResponseComponent } from "./components/main-response/main-response.component";
import { RegistrationFormComponent } from "./components/main-response/registration-form/registration-form.component";
import { AuthService } from "./services/auth.service";
import { SignInUpValidator } from "./validators/sign-in-up.validator";
import { LoginFormComponent } from "./components/main-response/login-form/login-form.component";
import { WelcomePageComponent } from "./components/main-response/welcome-page/welcome-page.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { HomeComponent } from "./components/main-response/home/home.component";
import { HttpAuthInterceptor } from "src/app/classes/http-auth-interceptor";
import { QuizListComponent } from './components/main-response/home/quiz-list/quiz-list.component';
//import { ErrorDialogComponent } from './components/main-response/error-dialog/error-dialog.component';

const appRoutes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "login", component: LoginFormComponent },
  { path: "registration", component: RegistrationFormComponent },
  { path: "home", component: HomeComponent, children: [
    { path: "quizlist", component: QuizListComponent }] }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainResponseComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    WelcomePageComponent,
    HomeComponent,
    QuizListComponent,
    //ErrorDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    ScrollingModule,
  ],
  entryComponents: [],
  providers: [
    AuthService, 
    SignInUpValidator,  
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpAuthInterceptor,
    multi: true
  },
  JwtHelperService
],
  bootstrap: [AppComponent],
})
export class AppModule {}