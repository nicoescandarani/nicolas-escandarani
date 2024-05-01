import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() items: any[] = [];
  @Input() minWidth: number = 500;

  selectedItem: number | null = null;

  @Output() editItem: EventEmitter<string> = new EventEmitter();
  @Output() deleteItem: EventEmitter<string> = new EventEmitter();

  selectItem(id: number): void {
    this.selectedItem !== id ? this.selectedItem = id : this.selectedItem = null;
  }

  handleEditItem(id: string): void {
    this.editItem.emit(id);
    this.selectedItem = null;
  }

  handleDeleteItem(id: string): void {
    this.deleteItem.emit(id);
    this.selectedItem = null;
  }
}
