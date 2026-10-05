import { Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { BookAddComponent } from './book-add/book-add.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { authGuard } from './auth.guard';
import { roleGuard } from './role.guard';

export const routes: Routes = [
  {
    path: 'book',
    component: BookComponent,
    canActivate: [authGuard],
  },
  {
    path: 'book/add',
    component: BookAddComponent,
    canActivate: [authGuard],
  },
  {
    path: 'book/edit/:id',
    component: BookEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'book/:id',
    component: BookDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'user/add',
    component: UserAddComponent,
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'user/edit/:id',
    component: UserEditComponent,
    canActivate: [authGuard, roleGuard],
  },
];
