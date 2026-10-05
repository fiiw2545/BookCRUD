import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { Book } from '../../models/book';
import { CategoryService } from '../services/category.service';
import { Category } from '../../models/category';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-book-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.css',
})
export class BookEditComponent {
  book: Book = {
    id: 0,
    isbn: '',
    name: '',
    price: 0,
    categoryId: 1,
    categoryName: '',
  };

  bookForm = new FormGroup({
    id: new FormControl(0),
    isbn: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    categoryId: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  categories: Category[] = [];
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loadBook();
  }

  loadBook() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.isLoading = true;

    this.bookService.getBook(id).subscribe({
      next: (data) => {
        this.bookForm.patchValue(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถโหลดข้อมูลหนังสือได้';

        this.router.navigate(['/book']);
      },
    });
  }

  editBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const book: Book = {
      id: this.bookForm.value.id ?? 0,
      isbn: this.bookForm.value.isbn ?? '',
      name: this.bookForm.value.name ?? '',
      price: this.bookForm.value.price ?? 0,
      categoryId: this.bookForm.value.categoryId ?? 0,
      categoryName: '',
    };

    this.isSaving = true;

    this.bookService.editBook(book).subscribe({
      next: () => {
        const returnUrl = history.state.returnUrl || '/book';

        this.router.navigateByUrl(returnUrl);
      },

      error: (err) => {
        console.error(err);
        this.isSaving = false;
        this.errorMessage =
          err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถแก้ไขหนังสือได้';
      },
    });
  }

  ngOnInit() {
    this.categoryService.listCategory().subscribe({
      next: (data) => {
        this.categories = data;
      },

      error: (err) => {
        console.error('Category error:', err);
      },
    });
  }

  cancel() {
    const returnUrl = history.state.returnUrl || '/book';

    this.router.navigateByUrl(returnUrl);
  }
}
