import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';

@Component({
  template: ''
})
export class AutoUnsubscribeComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  constructor() { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
