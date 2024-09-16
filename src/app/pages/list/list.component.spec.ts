import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductService } from '../../core/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ListComponent } from './list.component';
import { Category } from '../../core/models/product';

const mockCategories: Category[] = [
  { id: "1", name: 'Cat1' },
  { id: "2", name: 'Cat2' }
];

const mockProducts = [
  { id: "1", name: 'Product 1', price: 100, stock: 5, category: '1' },
  { id: "2", name: 'Product 2', price: 200, stock: 10, category: '2' },
  { id: "3", name: 'Product 3', price: 150, stock: 0, category: '1' },
  { id: "4", name: 'Product 4', price: 300, stock: 8, category: '2' }
];

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const productService = jasmine.createSpyObj('ProductService', ['getProducts', 'getCategories', 'deleteProduct']);
    const matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialog = jasmine.createSpyObj('MatDialog', ['open']);
    productService.getProducts.and.returnValue(of(mockProducts));
    productService.getCategories.and.returnValue(of(mockCategories));
    productService.deleteProduct.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ListComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and categories on initialization', () => {
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(productServiceSpy.getCategories).toHaveBeenCalled();

    expect(component.dataSource.data.length).toBe(4);
    expect(component.dataSource.data).toEqual(mockProducts);
  });

  it('should set paginator after view init', () => {
    expect(component.dataSource.paginator).toBeTruthy();
  });

  it('should update filter when filterProductHandle is called', () => {
    const filterEvent = { name: 'Test', price: 100, stock: 5, category: '1' };

    component.filterProductHandle(filterEvent);

    expect(component.filterName()).toBe('Test');
    expect(component.filterPrice()).toBe(100);
    expect(component.filterStock()).toBe(5);
    expect(component.filterCategory()).toBe('1');
  });

  it('should open confirm dialog when deleting a product', () => {
    const dialogRefMock = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefMock);

    component.deleteProduct('1');

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmComponent, {
      data: { title: 'Delete product', message: 'Would you like to delete this product?' },
    });

    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('1');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith('Product removed', '', component.snackBarConfig);
  });

  it('should not delete product if dialog is canceled', () => {
    const dialogRefMock = jasmine.createSpyObj({ afterClosed: of(false) });
    dialogSpy.open.and.returnValue(dialogRefMock);

    component.deleteProduct('1');

    expect(productServiceSpy.deleteProduct).not.toHaveBeenCalled();
  });
});