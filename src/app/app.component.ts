import { Component } from '@angular/core';
import { StateService } from './services/state/state.service';
import { Observable } from 'rxjs';
import { AutoUnsubscribeComponent } from './helpers/auto-unsubscribe/auto-unsubscribe.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AutoUnsubscribeComponent {
  isLoading$: Observable<boolean>;
  snackbarConfig: { message: string, show: boolean, type: 'success' | 'error' } = { message: '', show: false, type: 'success' };

  constructor(private stateService: StateService) {
    super();
    this.isLoading$ = this.stateService.isLoading$;
    const snackbarConfigSubscription$ = this.stateService.snackbarConfig$.subscribe((conf: { message: string, show: boolean, type: 'success' | 'error' }) => {
      this.snackbarConfig = conf;
    });
    this.subscriptions.push(snackbarConfigSubscription$);
  }
}
