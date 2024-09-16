import { FilterPipe } from './filter.pipe';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../models/product';

const mockProducts = [
  { name: 'Product 1', price: 100, stock: 5, category: 'Category A' },
  { name: 'Product 2', price: 200, stock: 10, category: 'Category B' },
  { name: 'Product 3', price: 150, stock: 0, category: 'Category A' },
  { name: 'Product 4', price: 300, stock: 8, category: 'Category C' }
];

describe('FilterPipe', () => {
  let pipe: FilterPipe;
  let dataSource: MatTableDataSource<Product>;

  it('create an instance', () => {
    const pipe = new FilterPipe();
    expect(pipe).toBeTruthy();
  });

  beforeEach(() => {
    pipe = new FilterPipe();
    dataSource = new MatTableDataSource<Product>();
    dataSource.data = mockProducts;
  });

  it('should filter products by name', () => {
    const filteredDataSource = pipe.transform(dataSource, 'product 1', 0, 0, '');
    expect(filteredDataSource.data.length).toBe(1);
    expect(filteredDataSource.data).toEqual([mockProducts[0]]);
  });

  it('should filter products by price', () => {
    const filteredDataSource = pipe.transform(dataSource, '', 150, 0, '');
    expect(filteredDataSource.data.length).toBe(3);
    expect(filteredDataSource.data).toEqual([mockProducts[1], mockProducts[2], mockProducts[3]]);
  });

  it('should filter products by stock', () => {
    const filteredDataSource = pipe.transform(dataSource, '', 0, 5, '');
    expect(filteredDataSource.data.length).toBe(3);
    expect(filteredDataSource.data).toEqual([mockProducts[0], mockProducts[1], mockProducts[3]]);
  });

  it('should filter products by category', () => {
    const filteredDataSource = pipe.transform(dataSource, '', 0, 0, 'Category A');
    expect(filteredDataSource.data.length).toBe(2);
    expect(filteredDataSource.data).toEqual([mockProducts[0], mockProducts[2]]);
  });

  it('should apply multiple filters together', () => {
    const filteredDataSource = pipe.transform(dataSource, 'product', 50, 5, 'Category A');
    expect(filteredDataSource.data.length).toBe(1);
    expect(filteredDataSource.data).toEqual([mockProducts[0]]);
  });

  it('should return all products when no filter is applied', () => {
    const filteredDataSource = pipe.transform(dataSource, '', 0, 0, '');
    expect(filteredDataSource.data.length).toBe(4);
    expect(filteredDataSource.data).toEqual(mockProducts);
  });
});
