import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { retry } from 'rxjs/operators';

import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from './../models/product.model';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // si desactivamos la proxy tenemos que decomentar el apiUrl que tiene la URL completa
  // private apiUrl = 'https://api.escuelajs.co/api/v1/products';
  private apiUrl = `${environment.API_URL}/api/v1/products`;
  constructor(private http: HttpClient) {}

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(retry(3));
  }

  getProdcductsByPage(limit: number, offset: number) {
    return this.http
      .get<Product[]>(this.apiUrl, {
        params: { limit, offset },
      })
      .pipe(retry(3));
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(`${this.apiUrl}`, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
