import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  userLevel = '';
  userName = '';
  isLoggedIn = false;

  private subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.subscription = this.authService.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      if (loggedIn) {
        const userJson = localStorage.getItem('user');

        if (userJson) {
          const user = JSON.parse(userJson);

          this.userLevel = user.level;
          this.userName = user.name;
        }
      } else {
        this.userLevel = '';
        this.userName = '';
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
