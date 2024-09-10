import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: Product[], name: string) {
    name = name ? name.toLowerCase() : '';
    return name ? value.filter(product => product.name.toLocaleLowerCase().includes(name)) : value;
  }

}
