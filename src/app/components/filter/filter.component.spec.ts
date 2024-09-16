import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductService } from '../../core/services/product.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { Category } from '../../core/models/product';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterComponent } from './filter.component';

const mockCategories: Category[] = [
  { id: "1", name: 'Cat1' },
  { id: "2", name: 'Cat2' }
];

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productService = jasmine.createSpyObj('ProductService', ['getCategories']);
    productService.getCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [FilterComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productService },
      ],
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const formValues = component.filterForm.value;
    expect(formValues).toEqual({
      name: '',
      price: 0,
      stock: 0,
      category: ''
    });
  });

  it('should emit filterProductEvent with form values when onChange is called', () => {
    spyOn(component.filterProductEvent, 'emit');

    component.filterForm.setValue({
      name: 'Product A',
      price: 100,
      stock: 5,
      category: 'Electronics'
    });

    component.onChange({});
    
    expect(component.filterProductEvent.emit).toHaveBeenCalledWith({
      name: 'Product A',
      price: 100,
      stock: 5,
      category: 'Electronics'
    });
  });

  it('should get categories from productService', () => {
    component.ngOnInit(); 

    component.categories.subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });
  });

  it('should update form control when user types in name field', () => {
    const nameInput = fixture.nativeElement.querySelector('#filter_name');
    nameInput.value = 'Test Name';
    nameInput.dispatchEvent(new Event('input'));
    
    expect(component.filterForm.controls['name'].value).toBe('Test Name');
  });

  it('should update form control when user types in price field', () => {
    const priceInput = fixture.nativeElement.querySelector('#filter_price');
    priceInput.value = '50';
    priceInput.dispatchEvent(new Event('input'));
    
    expect(component.filterForm.controls['price'].value).toBe(50);
  });

});
