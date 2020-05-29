import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private router: Router) {}

  inflightAuthRequest = null;

  blacklist: string[] = [
    'http://localhost:5000/Account/SignIn',
    'http://localhost:5000/Account/SignUp'
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.get("authExempt") === "true"|| this.blacklistCheckup(req.url)) {
      return next.handle(req);
    }
    const authService = this.injector.get(AuthService);

    if (!this.inflightAuthRequest) {
      this.inflightAuthRequest = authService.getToken();
    }

    return this.inflightAuthRequest.pipe(
      switchMap((newToken: string) => {
        this.inflightAuthRequest = null;

        const authReq = req.clone({
          headers: req.headers.set('token', newToken ? newToken : '')
        });

        return next.handle(authReq);
      }),
      catchError(error => {
        if (error.status === 401) {
          const isFromRefreshTokenEndpoint = !!error.headers.get(
            'unableToRefreshToken'
          );

          if (isFromRefreshTokenEndpoint) {
            localStorage.clear();
            this.router.navigate(['/sign-page']);
            return throwError(error);
          }

          if (!this.inflightAuthRequest) {
            this.inflightAuthRequest = authService.refreshToken();

            if (!this.inflightAuthRequest) {
              localStorage.clear();
              this.router.navigate(['/sign-page']);
              return throwError(error);
            }
          }

          return this.inflightAuthRequest.pipe(
            switchMap((newToken: string) => {
              
              this.inflightAuthRequest = null;

              const authReqRepeat = req.clone({
                headers: req.headers.set('token', newToken)
              });

              return next.handle(authReqRepeat);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  blacklistCheckup($url: string): boolean {
    return this.blacklist?.includes($url);
  }
}
