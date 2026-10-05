import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { UpdateUser } from '../../models/update-user';

@Component({
  selector: 'app-user-edit',
  imports: [FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  id: number = 0;
  usr: string = '';
  name: string = '';
  level: string = 'USER';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getUser();
  }

  getUser() {
    this.isLoading = true;
    this.userService.getUser(this.id).subscribe({
      next: (data) => {
        this.usr = data.usr;
        this.name = data.name;
        this.level = data.level;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;

        this.errorMessage =
          err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถโหลดข้อมูล User ได้';
      },
    });
  }

  cancel() {
    this.router.navigate(['/user']);
  }

  updateUser() {
    this.errorMessage = '';

    this.isSaving = true;

    const user: UpdateUser = {
      usr: this.usr,
      name: this.name,
      level: this.level,
    };

    this.userService.updateUser(this.id, user).subscribe({
      next: () => {
        this.router.navigate(['/user'], {
          state: {
            message: 'แก้ไข User สำเร็จ',
          },
        });
      },

      error: (err) => {
        console.error(err);

        this.isSaving = false;

        if (err.status === 409) {
          this.errorMessage = err.error?.message || 'ไม่สามารถแก้ไข User ได้';
        } else {
          this.errorMessage =
            err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถแก้ไข User ได้';
        }
      },
    });
  }
}
