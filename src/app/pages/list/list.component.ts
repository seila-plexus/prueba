
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs';
import { EMPTY } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { FilterComponent } from '../../components/filter/filter.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { Product } from '../../core/models/product';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FilterPipe } from "../../core/pipes/filter.pipe";
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule, RouterModule, MatTableModule,
    MatFormFieldModule, MatIconModule, MatButtonModule, FilterComponent, LoadingComponent, FilterPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  products!: Observable<Product[]>;
  searchTerm = signal<string>("");
  
  private _snackBar = inject(MatSnackBar);
  snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
  };

  constructor(private productService: ProductService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.products = this.getAllProducts();
  }

  getAllProducts() {
    return this.productService.getProducts().pipe(catchError((error: string) => {
      return EMPTY;
    }));
  }

  filterProductHandle(event: any) {
    console.log(event);
    this.searchTerm.set(event);
  }


  deleteProduct(id: string): void {
   const dialogRef = this.dialog.open(ConfirmComponent, {data: { tittle: 'Closed',}});
    dialogRef.afterClosed().subscribe(result => {
      if (result){
      this.productService.deleteProduct(id).subscribe(() => {
        this.products = this.getAllProducts();
        this._snackBar.open("Product removed", "", this.snackBarConfig)
      });
     }
    });
  }
}
