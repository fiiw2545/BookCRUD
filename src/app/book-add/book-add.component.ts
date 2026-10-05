import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { CategoryService } from '../services/category.service';
import { Book } from '../../models/book';
import { Category } from '../../models/category';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-book-add',
  imports: [ReactiveFormsModule],
  templateUrl: './book-add.component.html',
  styleUrl: './book-add.component.css',
})
export class BookAddComponent {
  book: Book = {
    id: 0,
    isbn: '',
    name: '',
    price: 0,
    categoryId: 1,
    categoryName: '',
  };

  categories: Category[] = [];
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  bookForm = new FormGroup({
    isbn: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    categoryId: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router,
  ) {}

  addBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }
    const book: Book = {
      id: 0,
      isbn: this.bookForm.value.isbn ?? '',
      name: this.bookForm.value.name ?? '',
      price: this.bookForm.value.price ?? 0,
      categoryId: this.bookForm.value.categoryId ?? 0,
      categoryName: '',
    };

    this.isSaving = true;

    this.bookService.addBook(book).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/book'], {
          state: {
            message: 'เพิ่มหนังสือสำเร็จ',
          },
        });
      },

      error: (err) => {
        console.error(err);

        this.isSaving = false;

        this.errorMessage =
          err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถเพิ่มหนังสือได้';
      },
    });
  }

  ngOnInit() {
    this.categoryService.listCategory().subscribe({
      next: (data) => {
        this.categories = data;

        console.log('Categories:', data);
      },

      error: (err) => {
        console.error('Category error:', err);
      },
    });
  }

  cancel() {
    this.router.navigate(['/book']);
  }
}
