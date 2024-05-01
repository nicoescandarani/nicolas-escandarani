import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Getters.
  /**
   * @return Observable<boolean>
   */
  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  // Setters.
  /**
   * @param value boolean.
   */
  set isLoadingSet(value: boolean) {
    this.isLoading.next(value);
  }
}
