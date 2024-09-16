import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from '../../core/services/loading.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './loading.component';
import { BehaviorSubject, of } from 'rxjs';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [], { loading: loadingSubject });

    await TestBed.configureTestingModule({
      imports: [LoadingComponent, NoopAnimationsModule],
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    }).compileComponents();

    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinnerElement).not.toBeNull();
  });

  it('should hide spinner when loading is false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();
    const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinnerElement).toBeNull();
  });
});
