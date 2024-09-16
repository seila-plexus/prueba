import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmComponent } from './confirm.component';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Test Title',
            message: 'Test Message',
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title and message', () => {
    const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    const messageElement = fixture.debugElement.query(By.css('mat-dialog-content')).nativeElement;

    expect(titleElement.textContent).toContain('Test Title');
    expect(messageElement.textContent).toContain('Test Message');
  });
});