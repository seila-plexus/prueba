import { Component, output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category, Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatSelectModule, CommonModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  filterProductEvent = output<Product>();
  filterForm: FormGroup;

  categories!: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      price: [0],
      stock: [0],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.categories = this.getAllCategories();
  }

  getAllCategories() {
    return this.productService.getCategories().pipe(catchError((error: string) => {
      return EMPTY;
    }));
  }

  onChange($event: any): void {
    console.log("test");
    let data: Product = {
      name: this.filterForm.controls["name"].value,
      price: this.filterForm.controls["price"].value,
      stock: this.filterForm.controls["stock"].value,
      category: this.filterForm.controls["category"].value
    }
    this.filterProductEvent.emit(data);
  }
}
