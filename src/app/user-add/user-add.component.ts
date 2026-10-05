import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CreateUser } from '../../models/create-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  imports: [FormsModule],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css',
})
export class UserAddComponent {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  usr: string = '';
  pwd: string = '';
  name: string = '';
  level: string = 'USER';

  isSaving = false;
  errorMessage = '';

  addUser() {
    if (!this.usr || this.usr.length < 4) {
      return;
    }

    if (!this.pwd || this.pwd.length < 6) {
      return;
    }

    if (!this.name) {
      return;
    }

    this.isSaving = true;

    const user: CreateUser = {
      usr: this.usr,
      pwd: this.pwd,
      name: this.name,
      level: this.level,
    };

    this.userService.createUser(user).subscribe({
      next: () => {
        this.router.navigate(['/user'], {
          state: {
            message: 'สร้าง User สำเร็จ',
          },
        });
      },

      error: (err) => {
        console.error(err);
        this.isSaving = false;
        if (err.status === 409) {
          this.errorMessage = err.error?.message || 'Username นี้มีอยู่แล้ว';
        } else {
          this.errorMessage =
            err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถสร้าง User ได้';
        }
      },
    });
  }

  cancel() {
    this.router.navigate(['/user']);
  }
}
