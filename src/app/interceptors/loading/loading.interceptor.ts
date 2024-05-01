import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StateService } from 'src/app/services/state/state.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private countRequest = 0; // Counts the number of requests.

  constructor(private stateService: StateService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.countRequest === 0) { // If this is the only request, show the loading spinner.
      setTimeout(() => {
        this.stateService.isLoadingSet = true;
      }, 0);
    }
    this.countRequest++;
    return next.handle(request)
      .pipe(
        finalize(() => {
          this.countRequest--;
          if (this.countRequest === 0) { // If this is the last request, hide the loading spinner.
            this.stateService.isLoadingSet = false;
          }
        })
      );
  }
}
