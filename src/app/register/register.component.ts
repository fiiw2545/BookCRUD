import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  registerForm = new FormGroup({
    usr: new FormControl('', [Validators.required, Validators.minLength(4)]),

    pwd: new FormControl('', [Validators.required, Validators.minLength(6)]),

    name: new FormControl('', [Validators.required]),
  });

  register() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const usr = this.registerForm.value.usr!;
    const pwd = this.registerForm.value.pwd!;
    const name = this.registerForm.value.name!;
    this.userService
      .register(usr, pwd, name)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.successMessage = data.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          switch (err.status) {
            case 409:
              this.errorMessage = 'Username นี้มีอยู่แล้ว';
              break;

            case 400:
              this.errorMessage = 'กรุณาตรวจสอบข้อมูลที่กรอก';
              break;

            case 500:
              this.errorMessage = 'เกิดข้อผิดพลาดที่ Server';
              break;

            default:
              this.errorMessage =
                'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง';
          }
        },
      });
  }
}
