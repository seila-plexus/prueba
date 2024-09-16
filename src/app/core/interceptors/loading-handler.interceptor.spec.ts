import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { loadingHandlerInterceptor } from './loading-handler.interceptor';
import { provideHttpClient, HttpClient, HttpErrorResponse, withInterceptors } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { LoadingService } from '../services/loading.service';

describe('loadingHandlerInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  const testUrl = '/test-url';

  beforeEach(() => {
    const loadingService = jasmine.createSpyObj('LoadingService', ['setLoading']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LoadingService, useValue: loadingService },
        provideHttpClient(withInterceptors([loadingHandlerInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(loadingHandlerInterceptor).toBeTruthy();
  });

  it('should set loading to true on request start', () => {
    httpClient.get(testUrl).subscribe();

    const req = httpTestingController.expectOne(testUrl);
    req.flush({});

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
  });

  it('should set loading to false on request completion when no more requests are pending', () => {
    httpClient.get(testUrl).subscribe();

    const req = httpTestingController.expectOne(testUrl);
    req.flush({});

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should handle multiple requests correctly', () => {
    httpClient.get(testUrl).subscribe();
    httpClient.get(testUrl).subscribe();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const requests = httpTestingController.match(testUrl);
    requests.forEach(req => req.flush({}));

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should set loading to false when requests are canceled', () => {
    const req = httpClient.get(testUrl).subscribe();
    
    const request = httpTestingController.expectOne(testUrl);
    request.flush({});

    req.unsubscribe();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });
});
