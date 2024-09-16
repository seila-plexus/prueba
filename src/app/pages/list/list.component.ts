import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit, inject, signal, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs';
import { EMPTY } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { FilterComponent } from '../../components/filter/filter.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { Product, Category } from '../../core/models/product';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FilterPipe } from "../../core/pipes/filter.pipe";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule, RouterModule, MatTableModule,
    MatFormFieldModule, MatIconModule, MatButtonModule, FilterComponent, 
    LoadingComponent, FilterPipe, MatPaginatorModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, AfterViewInit {
  products!: Observable<Product[]>;
  categories!: Observable<Category[]>;
  
  filterName = signal<string>("");
  filterPrice = signal<number>(0);
  filterStock = signal<number>(0);
  filterCategory = signal<string>("");
  
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  
  dataSource = new MatTableDataSource<Product>();
  private _snackBar = inject(MatSnackBar);
  snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
  };

  constructor(private productService: ProductService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.setProducts();
  }

  ngAfterViewInit() {
    if(this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getAllProducts() {
    return this.productService.getProducts().pipe(catchError((error: string) => {
      return EMPTY;
    }));
  }

  getAllCategories() {
    return this.productService.getCategories().pipe(catchError((error: string) => {
      return EMPTY;
    }));
  }

  setProducts() {
    this.categories = this.getAllCategories();
    this.categories.subscribe(categories => {
      this.products = this.getAllProducts();
      this.products.subscribe(products => {
        this.dataSource.data = products;
        this.dataSource.data.forEach((element) => {
          let catId = element.category? element.category : "0";
          let catElement = categories.find((category) => category.id == catId);
          element.category = catElement?.name;
        });
        if(this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      });
    });
  }

  filterProductHandle(event: any) {
    this.filterName.set(event.name);
    this.filterPrice.set(event.price);
    this.filterStock.set(event.stock);
    this.filterCategory.set(event.category);
    if(this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  openConfirmDialog(): MatDialogRef<any> {
    return this.dialog.open(ConfirmComponent, {
      data: {title: "Delete product", message: "Would you like to delete this product?"},
    });
  }

  deleteProduct(id: string): void {
    const dialogRef = this.openConfirmDialog();
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.setProducts();
          this._snackBar.open("Product removed", "", this.snackBarConfig);
        });
      }
    });
  }
}
