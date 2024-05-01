import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  authorId: string = '450';

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Clone the original request and add the 'authorId' header.
    const authReq = request.clone({
      headers: request.headers.set('authorId', this.authorId)
    });

    // Pass the modified request to the next handler.
    return next.handle(authReq);
  }
}
