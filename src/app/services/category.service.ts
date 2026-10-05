import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { env } from '../../environments/environment';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  listCategory() {
    return this.http.get<Category[]>(env.apiUrl + '/Category/ListCategory');
  }
}
