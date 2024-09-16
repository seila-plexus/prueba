import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product, Category } from '../models/product';
import { ProductService } from './product.service';

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

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API via GET', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(4);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should retrieve a product by id from the API via GET', () => {
    const productId = '1';

    service.getProductById(productId).subscribe((product) => {
      expect(product).toEqual(mockProducts[0]);
    });

    const req = httpMock.expectOne(`http://localhost:3000/products/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts[0]);
  });

  it('should retrieve categories from the API via GET', () => {
    service.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne('http://localhost:3000/categories');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should create a new product via POST', () => {
    const newProduct: Product = { id: '53', name: 'New product', price: 300, stock: 30, category: '3' };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(newProduct);
  });

  it('should update an existing product via PUT', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', price: 150, stock: 15, category: '1' };

    service.updateProduct(updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`http://localhost:3000/products/${updatedProduct.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(updatedProduct);
  });

  it('should delete a product via DELETE', () => {
    const productId = '1';

    service.deleteProduct(productId).subscribe((product) => {
      expect(product).toEqual(mockProducts[0]);
    });

    const req = httpMock.expectOne(`http://localhost:3000/products/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProducts[0]);
  });
});
