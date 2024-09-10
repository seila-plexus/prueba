import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category, Product } from '../models/product';

const apiProducts = 'http://localhost:3000/products'
const apiCategories = 'http://localhost:3000/categories'
const httpOptions ={
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [];

  constructor(private http: HttpClient) { }

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(apiProducts);
  }

  getProductById(id:string): Observable<Product>{
    return this.http.get<Product>(apiProducts+"/" + id);
  }

  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(apiCategories);
  }

  getCategoriesById(id:number): Observable<Product>{
    return this.http.get<Product>(apiCategories+"/" + id);
  }

  createProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(apiProducts, product, httpOptions)
  }

  updateProduct(product: Product): Observable<Product>{
    return this.http.put<Product>(apiProducts + "/" + product.id, product, httpOptions)
  }

  deleteProduct(id: string): Observable<Product>{
    return this.http.delete<Product>(apiProducts + "/" + id, httpOptions)
  }
}
