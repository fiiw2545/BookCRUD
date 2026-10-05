import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
  ) {}

  loginForm = new FormGroup({
    usr: new FormControl('', Validators.required),
    pwd: new FormControl('', Validators.required),
  });

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  login() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const usr = this.loginForm.value.usr ?? '';
    const pwd = this.loginForm.value.pwd ?? '';

    this.userService
      .login(usr, pwd)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (data) => {
          console.log('Login success:', data);
          this.successMessage = data.message;

          localStorage.setItem('token', data.token);

          localStorage.setItem('user', JSON.stringify(data.user));
          this.authService.login();
          this.router.navigate(['/book']);
        },

        error: (err) => {
          console.log(err);

          if (err.status === 401) {
            this.errorMessage = err.error.message;
          }

          if (err.status === 400) {
            this.errorMessage = 'กรุณาตรวจสอบข้อมูลที่กรอก';
          }

          if (err.status === 500) {
            this.errorMessage = 'เกิดข้อผิดพลาดที่ Server';
          } else {
            this.errorMessage = 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง';
          }
        },
      });
  }
}
