import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductService } from '../../../core/services/product.service';
import { Category, Product } from '../../../core/models/product';
import { FormComponent } from './form.component';

const mockCategories: Category[] = [
  { id: "1", name: 'Cat1' },
  { id: "2", name: 'Cat2' }
];

const mockProduct = {
  id: "1", name: 'Product 1', price: 100, stock: 5, category: '1'
};

const mockNewProduct = {
  id: "10", name: 'New product', price: 100, stock: 5, category: '2'
};

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const productService = jasmine.createSpyObj('ProductService', ['getProductById', 'getCategories', 'updateProduct', 'createProduct']);
    const snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialog = jasmine.createSpyObj('MatDialog', ['open']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRoute = {
      snapshot: { paramMap: { get: () => '1' } }
    };
    productService.getProductById.and.returnValue(of(mockProduct));
    productService.getCategories.and.returnValue(of(mockCategories));
    productService.updateProduct.and.returnValue(of(of(mockProduct)));
    productService.createProduct.and.returnValue(of(of(mockNewProduct)));

    await TestBed.configureTestingModule({
      imports: [FormComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    component.ngOnInit();
    expect(component.productForm).toBeDefined();
    expect(component.productForm.controls['name']).toBeTruthy();
    expect(component.productForm.controls['price']).toBeTruthy();
    expect(component.productForm.controls['description']).toBeTruthy();
    expect(component.productForm.controls['category']).toBeTruthy();
    expect(component.productForm.controls['stock']).toBeTruthy();
  });

  it('should fetch product by ID if editing', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Product 1',
      price: 100,
      description: 'Test Description',
      category: '1',
      stock: 10
    };

    productServiceSpy.getProductById.and.returnValue(of(mockProduct));

    component.ngOnInit();
    fixture.detectChanges();

    expect(productServiceSpy.getProductById).toHaveBeenCalledWith('1');
    expect(component.productForm.value.name).toBe('Product 1');
    expect(component.productForm.value.price).toBe(100);
    expect(component.productForm.value.description).toBe('Test Description');
  });

  it('should open confirm dialog and update product when editing', () => {
    const dialogRefMock = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefMock);

    component.productId = '1';
    component.productForm.patchValue({
      name: 'Updated Product',
      price: 200,
      description: 'Updated Description',
      category: '1',
      stock: 50
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(dialogSpy.open).toHaveBeenCalled();

    expect(productServiceSpy.updateProduct).toHaveBeenCalledWith({
      id: '1',
      name: 'Updated Product',
      price: 200,
      description: 'Updated Description',
      category: '1',
      stock: 50
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith('Updated product', '', component.snackBarConfig);
  });

  it('should open confirm dialog and create product when adding a new product', () => {
    const dialogRefMock = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefMock);

    component.productId = null;
    component.productForm.patchValue({
      name: 'New Product',
      price: 150,
      description: 'New Description',
      category: '1',
      stock: 20
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(dialogSpy.open).toHaveBeenCalled();

    expect(productServiceSpy.createProduct).toHaveBeenCalledWith({
      name: 'New Product',
      price: 150,
      description: 'New Description',
      category: '1',
      stock: 20
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith('Product added', '', component.snackBarConfig);
  });

  it('should not submit the form if it is invalid', () => {
    component.productForm.controls['name'].setValue('');
    component.onSubmit();

    expect(dialogSpy.open).not.toHaveBeenCalled();
    expect(productServiceSpy.updateProduct).not.toHaveBeenCalled();
    expect(productServiceSpy.createProduct).not.toHaveBeenCalled();
  });
});
