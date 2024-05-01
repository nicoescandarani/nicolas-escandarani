import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, of, throwError } from 'rxjs';
import { Product } from 'src/app/list/interfaces/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  async getProductsPromise(): Promise<Product[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${environment.API_URL_BASE}/bp/products`)
        );
        return response;
    } catch (e) {
      console.warn('Error: ', e);
      return [];
    }
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL_BASE}/bp/products`).pipe(
      catchError(error => {
        // TODO: Add error handling logic.
        console.warn('Error fetching products:', error);
        return of([]); // Returns an Observable of an empty array in case of error.
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL_BASE}/bp/products/?id=${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        console.warn('Error deleting product:', error);
        return of(); // Returns an Observable of an empty array in case of error.
      })
    );
  }

  editProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.API_URL_BASE}/bp/products`, product).pipe(
      catchError(error => {
        // TODO: Add error handling logic.
        console.warn('Error editing product:', error);
        return of(); // Returns an Observable of an empty array in case of error.
      })
    );
  }

  checkIdAvailability(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.API_URL_BASE}/bp/products/verification?id=${id}`).pipe(
      catchError(error => {
        // TODO: Add error handling logic.
        console.warn('Error editing product:', error);
        return of(); // Returns an Observable of an empty array in case of error.
      }
    ));
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.API_URL_BASE}/bp/products`, product).pipe(
      catchError(error => {
        // TODO: Add error handling logic.
        console.warn('Error editing product:', error);
        return of(); // Returns an Observable of an empty array in case of error.
      }
    ));
  }
}
