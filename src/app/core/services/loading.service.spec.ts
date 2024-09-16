import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize loading as false', (done: DoneFn) => {
    service.loading.subscribe((loadingState) => {
      expect(loadingState).toBeFalse();
      done();
    });
  });

  it('should set loading to true', (done: DoneFn) => {
    service.setLoading(true);

    service.loading.subscribe((loadingState) => {
      expect(loadingState).toBeTrue();
      done();
    });
  });

  it('should set loading to false after being true', (done: DoneFn) => {
    service.setLoading(true);
    service.setLoading(false);

    service.loading.subscribe((loadingState) => {
      expect(loadingState).toBeFalse();
      done();
    });
  });

  it('should emit correct loading values on multiple changes', (done: DoneFn) => {
    const expectedStates = [true, false, true];
    let index = 0;

    service.loading.subscribe((loadingState) => {
      expect(loadingState).toBe(!expectedStates[index]);
      index++;
      if (index === expectedStates.length) {
        done();
      }
    });

    service.setLoading(true);
    service.setLoading(false);
    service.setLoading(true);
  });
});
