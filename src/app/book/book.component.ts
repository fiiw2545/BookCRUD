import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../../models/book';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book',
  imports: [RouterLink, FormsModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  paginatedBooks: Book[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  searchText = '';
  userLevel = '';

  isEdit = false;
  isLoading = false;
  deletingBookId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private bookService: BookService) {
    const message = history.state.message || '';

    history.replaceState({}, '');

    if (message) {
      this.showSuccessMessage(message);
    }

    this.loadBooks();
  }
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.userLevel = user.level;
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  DeleteBook(id: number, name: string) {
    this.errorMessage = '';
    const result = confirm(`คุณต้องการลบหนังสือ "${name}" หรือไม่?`);

    if (result) {
      this.deletingBookId = id;

      this.bookService.deleteBook(id).subscribe({
        next: (data) => {
          console.log(data);
          this.deletingBookId = null;
          this.showSuccessMessage('ลบหนังสือสำเร็จ');

          this.loadBooks();
        },
        error: (err) => {
          console.error(err);
          this.deletingBookId = null;
          this.errorMessage =
            err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถลบหนังสือได้';

          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        },
      });
    }
  }

  loadBooks() {
    this.isLoading = true;

    this.bookService
      .listBook()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (data) => {
          this.books = data;
          this.filteredBooks = data;
          this.updatePagination();
          this.isLoading = false;
        },

        error: (err) => {
          console.error(err);
          this.isLoading = false;
          alert(
            err.error?.message ||
              'เกิดข้อผิดพลาด ไม่สามารถโหลดข้อมูลหนังสือได้',
          );
        },
      });
  }

  filterBooks() {
    const text = this.searchText.toLowerCase().trim();

    this.filteredBooks = this.books.filter(
      (book) =>
        book.isbn.toLowerCase().includes(text) ||
        book.name.toLowerCase().includes(text),
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearch() {
    this.searchText = '';
    this.filteredBooks = this.books;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
  }
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
