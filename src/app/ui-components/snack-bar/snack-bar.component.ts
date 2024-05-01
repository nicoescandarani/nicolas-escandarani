import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'ui-snack-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent {
  @Input() show: boolean = true;
  @Input() message: string = '';
  @Input()
  set type(value: 'success' | 'error') {
    this._type = value;
    setTimeout(() => {
      this.stateService.snackbarConfigSet = { message: this.message, show: false, type: this.type};
    }, 8000);
  }

  private _type: 'success' | 'error' = 'success';

  constructor(private stateService: StateService) { }

  get type(): 'success' | 'error' {
    return this._type;
  }
}
