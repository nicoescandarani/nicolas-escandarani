import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { HeaderInterceptor } from './header.interceptor';
import { of } from 'rxjs';

describe('HeaderInterceptor', () => {
  let interceptor: HeaderInterceptor;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeaderInterceptor,
        {
          provide: HttpHandler,
          useValue: {
            handle: (request: HttpRequest<any>) => {
              return of(new HttpResponse({ status: 200, body: { data: 'data' }}));
            }
          }
        }
      ]
    });

    interceptor = TestBed.inject(HeaderInterceptor);
    mockHttpHandler = TestBed.inject(HttpHandler);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add an authorId header to the request', (done: DoneFn) => {
    const dummyRequest = new HttpRequest('GET', '/test-url');
    const handleSpy = spyOn(mockHttpHandler, 'handle').and.callThrough();

    // Execute the interceptor.
    interceptor.intercept(dummyRequest, mockHttpHandler).subscribe(event => {
      expect(event).toBeTruthy();
      expect(event instanceof HttpResponse).toBeTruthy();
      expect(handleSpy).toHaveBeenCalledTimes(1);
      expect(handleSpy.calls.mostRecent().args[0].headers.has('authorId')).toBeTrue();
      expect(handleSpy.calls.mostRecent().args[0].headers.get('authorId')).toEqual('450');
      done();
    });
  });
});
