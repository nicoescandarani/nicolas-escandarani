import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { take } from 'rxjs/operators';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially emit false for isLoading$', (done: DoneFn) => {
    service.isLoading$.pipe(take(1)).subscribe(isLoading => {
      expect(isLoading).toBeFalse();
      done();
    });
  });

  it('should emit true when isLoadingSet is set to true', (done: DoneFn) => {
    service.isLoadingSet = true;
    service.isLoading$.pipe(take(1)).subscribe(isLoading => {
      expect(isLoading).toBeTrue();
      done();
    });
  });

  it('should toggle isLoading correctly', (done: DoneFn) => {
    // Initial state is false as checked in previous test
    service.isLoadingSet = true; // Set to true
    service.isLoading$.pipe(take(1)).subscribe(isLoading => {
      expect(isLoading).toBeTrue();

      service.isLoadingSet = false; // Set back to false
      service.isLoading$.pipe(take(1)).subscribe(isLoadingAgain => {
        expect(isLoadingAgain).toBeFalse();
        done();
      });
    });
  });
});
