import { Component } from '@angular/core';
import { StateService } from './services/state/state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading$: Observable<boolean>;

  title = 'prueba-productos-bancarios-nicolas-escandarani';

  constructor(private stateService: StateService) {
    this.isLoading$ = this.stateService.isLoading$;
  }
}
