import { Component, output } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  [x: string]: any;
  filterProductEvent = output<Product>();
  filterForm: FormGroup;
  filter: FormControl = new FormControl<string>('');

  constructor(
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      filter: ['', Validators.required]
    });
  }

  onChange($event: any):void {
    this.filterProductEvent.emit(this.filterForm.controls["filter"].value);
  }
}
