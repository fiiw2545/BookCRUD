import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';
import { Book } from '../../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  listBook() {
    return this.http.get<Book[]>(env.apiUrl + '/Book/ListBook');
  }

  addBook(book: Book) {
    return this.http.post(env.apiUrl + '/Book/AddBook', book);
  }

  getBook(id: number) {
    return this.http.get<Book>(env.apiUrl + '/Book/GetBook/' + id);
  }

  editBook(book: Book) {
    return this.http.put(env.apiUrl + '/Book/EditBook', book);
  }

  deleteBook(id: number) {
    return this.http.delete(env.apiUrl + '/Book/DeleteBook/' + id);
  }
}
