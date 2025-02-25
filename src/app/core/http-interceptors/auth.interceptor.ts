import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', localStorage.getItem('onlineToken') || '')
    });
    return next.handle(authReq)
    .pipe(
      // filter((response: HttpResponse<any>) => ),
      map( (response: HttpResponse<any>) => {
          if ( response && response.status === 403) {
            console.error('Token di accesso scaduto, logout!');
            localStorage.removeItem('onlineToken');
            this.router.navigate([]);
          }
          return response;
      })
    );
  }
}

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
