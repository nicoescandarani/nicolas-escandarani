import { TestBed } from '@angular/core/testing';
import { HttpHandler } from '@angular/common/http';
import { LoadingInterceptor } from './loading.interceptor';
import { StateService } from 'src/app/services/state/state.service';

describe('LoadingInterceptor', () => {
  let interceptor: LoadingInterceptor;
  let mockHttpHandler: jasmine.SpyObj<HttpHandler>;
  let mockStateService: jasmine.SpyObj<StateService>;

  beforeEach(() => {
    mockHttpHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
    mockStateService = jasmine.createSpyObj('StateService', ['isLoadingSet']);

    TestBed.configureTestingModule({
      providers: [
        LoadingInterceptor,
        { provide: HttpHandler, useValue: mockHttpHandler },
        { provide: StateService, useValue: mockStateService }
      ]
    });

    interceptor = TestBed.inject(LoadingInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
