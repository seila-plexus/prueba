import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs';
import { EMPTY } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category } from '../../../core/models/product';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoadingComponent } from '../../../components/loading/loading.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    MatTableModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatError, MatButtonModule, MatSelectModule, LoadingComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  productForm: FormGroup;
  name: FormControl = new FormControl<string>('');
  price: FormControl = new FormControl<number>(0);
  description: FormControl = new FormControl<string>('');
  category: FormControl = new FormControl<string>('');
  stock: FormControl = new FormControl<number>(0);

  private _snackBar = inject(MatSnackBar);
  snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
  };

  productId: string | null = null;
  categories!: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: [''],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe((product) => {
        if (product) {
          this.productForm.patchValue(product);
        }
      });
    }
    this.categories = this.getAllCategories();
  }

  getAllCategories() {
    return this.productService.getCategories().pipe(catchError((error: string) => {
      return EMPTY;
    }));
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      if (this.productId && this.productId != "0") {
        product.id = this.productId;
        this.productService.updateProduct(product).subscribe(() => {
          this._snackBar.open("Updated product", "", this.snackBarConfig);
          this.router.navigate(['/products']);
        });
      } else {
        this.productService.createProduct(product).subscribe((product) => {
          this._snackBar.open("Product added", "", this.snackBarConfig);
          this.router.navigate(['/products']);
        });
      }
    }
  }
}