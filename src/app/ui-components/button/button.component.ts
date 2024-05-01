import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() color: 'primary' | 'secondary' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fontSize: number = 16;
  @Input() fontWeight: number = 600;
  @Input() disabled = false;

  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  click(): void {
    this.onClick.emit();
  }
}
