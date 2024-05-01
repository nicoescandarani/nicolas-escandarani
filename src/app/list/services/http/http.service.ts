import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, of, throwError } from 'rxjs';
import { Product } from 'src/app/list/interfaces/product';
import { StateService } from 'src/app/services/state/state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, private stateService: StateService) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL_BASE}/bp/products`).pipe(
      catchError(error => {
        this.stateService.snackbarConfigSet = { message: 'Error al obtener los productos.', show: true, type: 'error' };
        return of([]); // Returns an Observable of an empty array in case of error.
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL_BASE}/bp/products/?id=${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        this.stateService.snackbarConfigSet = { message: `Error al eliminar el producto con id ${id}.`, show: true, type: 'error' };
        return of(); // Returns an Observable of an empty array in case of error.
      })
    );
  }

  editProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.API_URL_BASE}/bp/products`, product).pipe(
      catchError(error => {
        this.stateService.snackbarConfigSet = { message: `Error al editar el producto con id ${product.id}.`, show: true, type: 'error' };
        return of(); // Returns an Observable of an empty array in case of error.
      })
    );
  }

  checkIdAvailability(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.API_URL_BASE}/bp/products/verification?id=${id}`).pipe(
      catchError(error => {
        this.stateService.snackbarConfigSet = { message: `Error al obtener la disponibilidad del id ${id}.`, show: true, type: 'error' };
        return of(); // Returns an Observable of an empty array in case of error.
      }
    ));
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.API_URL_BASE}/bp/products`, product).pipe(
      catchError(error => {
        this.stateService.snackbarConfigSet = { message: 'Error al crear el producto bancario', show: true, type: 'error' };
        return of(); // Returns an Observable of an empty array in case of error.
      }
    ));
  }
}
