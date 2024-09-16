import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorHandlerInterceptor } from './error-handler.interceptor';
import { provideHttpClient, HttpClient, HttpErrorResponse, withInterceptors } from '@angular/common/http';
import { catchError, of } from 'rxjs';

describe('ErrorHandlerInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const testUrl = '/test-url';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(withInterceptors([errorHandlerInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(errorHandlerInterceptor).toBeTruthy();
  });

  it('should handle client-side errors', () => {
    const errorEvent = new ErrorEvent('Network error');

    httpClient.get(testUrl).pipe(
      catchError((error: string) => {
        expect(error).toEqual('Error: ');
        return of();
      })
    ).subscribe({
      next: () => fail('should have failed with the network error')
    });

    const req = httpTestingController.expectOne(testUrl);
    req.error(errorEvent);
  });

  it('should handle server-side errors', () => {
    httpClient.get(testUrl).pipe(
      catchError((error: string) => {
        expect(error).toEqual('Error code: 404, message: Http failure response for /test-url: 404 Not Found');
        return of();
      })
    ).subscribe({
      next: () => fail('should have failed with the network error'),
      error: () => fail('should have handled the error')
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});