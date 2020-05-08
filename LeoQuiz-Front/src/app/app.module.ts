import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./components/app/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { MainResponseComponent } from "./components/main-response/main-response.component";
import { RegistrationFormComponent } from "./components/main-response/registration-form/registration-form.component";
import { SignInUpService } from "./services/sign-in-up.service";
import { LoginFormComponent } from "./components/main-response/login-form/login-form.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { WelcomePageComponent } from "./components/main-response/welcome-page/welcome-page.component";
 
import { ScrollingModule } from "@angular/cdk/scrolling";

const appRoutes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "login", component: LoginFormComponent },
  { path: "registration", component: RegistrationFormComponent },
  
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainResponseComponent,
    RegistrationFormComponent,
    WelcomePageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    MatDatepickerModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    ScrollingModule
  ],
  entryComponents: [   
  ],
  providers: [
    SignInUpService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}