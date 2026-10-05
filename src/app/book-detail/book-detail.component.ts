import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; //อ่านค่าจาก:id
import { BookService } from '../services/book.service';
import { Book } from '../../models/book';
import { CategoryService } from '../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-book-detail',
  imports: [],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
})
export class BookDetailComponent {
  book: Book | null = null;
  isLoading = true;
  errorMessage = '';
  userLevel = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
  ) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userLevel = user.level || '';

    this.loadBook();
  }

  loadBook() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getBook(id).subscribe({
      next: (data) => {
        this.book = data;
        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'ไม่พบหนังสือที่ต้องการ';
      },
    });
  }
  goBack() {
    this.router.navigate(['/book']);
  }

  editBook() {
    if (!this.book) {
      return;
    }

    this.router.navigate(['/book/edit', this.book.id], {
      state: {
        returnUrl: `/book/${this.book.id}`,
      },
    });
  }
}
