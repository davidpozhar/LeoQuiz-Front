import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, tap, take } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        return !!user;
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(["/login"]);
        }
      })
    );
  }
}

@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        return !!user;
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(["/login"]);
        } else if (
          JSON.parse(localStorage.getItem("userData")).userRole !== 2
        ) {
          this.router.navigate(["/home"]);
        }
      })
    );
  }
}

@Injectable({ providedIn: "root" })
export class QuizListGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        return !!user;
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(["/login"]);
        } else if (
          JSON.parse(localStorage.getItem("userData")).userRole !== 2
        ) {
          this.router.navigate(["/quizlist"]);
        }
      })
    );
  }
}
