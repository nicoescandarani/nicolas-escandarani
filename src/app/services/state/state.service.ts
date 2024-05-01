import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private snackbarConfig: BehaviorSubject<{ message: string, show: boolean, type: 'success' | 'error' }> = new BehaviorSubject<{ message: string, show: boolean, type: 'success' | 'error' }>({ message: '', show: false, type: 'success' });

  // Getters.

  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }
  get snackbarConfig$(): Observable<{ message: string, show: boolean, type: 'success' | 'error' }> {
    return this.snackbarConfig.asObservable();
  }

  // Setters.
  set isLoadingSet(value: boolean) {
    this.isLoading.next(value);
  }
  set snackbarConfigSet(value: { message: string, show: boolean, type: 'success' | 'error' }) {
    this.snackbarConfig.next(value);
  }
}
