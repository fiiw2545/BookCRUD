import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserList } from '../../models/user-list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [FormsModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  users: UserList[] = [];
  filteredUsers: UserList[] = [];
  searchText: string = '';
  isLoading = false;
  deletingUserId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}
  ngOnInit() {
    const message = history.state.message || '';

    history.replaceState({}, '');

    if (message) {
      this.showSuccessMessage(message);
    }

    this.loadUsers();
  }
  loadUsers() {
    this.isLoading = true;

    this.userService.UserList().subscribe({
      next: (data) => {
        console.log('User data:', data);

        this.users = data;
        this.filteredUsers = data;

        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);

        this.isLoading = false;

        this.errorMessage =
          err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถโหลดข้อมูล User ได้';
      },
    });
  }

  filterUsers() {
    const keyword = this.searchText.toLowerCase();

    this.filteredUsers = this.users.filter(
      (user) =>
        user.id.toString().includes(keyword) ||
        user.usr.toLowerCase().includes(keyword) ||
        user.name.toLowerCase().includes(keyword) ||
        user.level.toLowerCase().includes(keyword),
    );
  }
  showSuccessMessage(message: string) {
    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  deleteUser(id: number, name: string) {
    const confirmDelete = confirm(`คุณต้องการลบ User "${name}" ใช่หรือไม่?`);

    if (!confirmDelete) {
      return;
    }

    this.deletingUserId = id;
    this.errorMessage = '';

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.deletingUserId = null;

        this.showSuccessMessage('ลบ User สำเร็จ');

        this.loadUsers();
      },

      error: (err) => {
        console.error(err);

        this.deletingUserId = null;

        this.errorMessage =
          err.error?.message || 'เกิดข้อผิดพลาด ไม่สามารถลบ User ได้';
      },
    });
  }
}
