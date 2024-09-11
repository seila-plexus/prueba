import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: MatTableDataSource<Product, MatPaginator>, name: string, price: number, stock: number, category: string) {
    name = name ? name.toLowerCase() : '';
    let valueAux = new MatTableDataSource<Product>();
    valueAux.paginator = value.paginator;
    valueAux.data = name ? value.data.filter(product => product.name.toLowerCase().includes(name)) : value.data;
    valueAux.data = valueAux.data.filter(product => product.price >= price);
    valueAux.data = valueAux.data.filter(product => product.stock >= stock);
    valueAux.data = category ? valueAux.data.filter(product => product.category == category) : valueAux.data;
    return valueAux;
  }

}
