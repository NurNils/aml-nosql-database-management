import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

/**
 * Authorization Interceptor
 * Applies an `Authorization` header to each API request.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /** Constructor */
  constructor(private authService: AuthService, private router: Router) {}

  /** Intercept API request and add an `Authorization` header */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // This  interceptor will only be applied to API requests
    if (!request.url.startsWith(env.api.baseUrl)) {
      return next.handle(request);
    }

    // Set cookies
    const req = request.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigateByUrl(`/login`);
          return throwError(error);
        }
      })
    );
  }
}
