import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service'; // Path check kar lein
import { CommonModule } from '@angular/common';
import { CartService } from '../cartservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public authService: AuthService, private router: Router, public cartservice : CartService) {}
  cartCount$ = this.cartservice.cartCount$;

onLogout() {
  Swal.fire({
    title: 'Logging Out?',
    text: "Are you sure you want to end your session?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2d3436', // Dark color for logout
    cancelButtonColor: '#d33',     // Red color for cancel
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Stay Logged In',
    reverseButtons: true // Buttons ki position swipe karne ke liye (optional)
  }).then((result) => {
    if (result.isConfirmed) {
      // 1. Service se logout call karein
      this.authService.Logout();

      // 2. Success Toast (Chota sa message corner mein)
      Swal.fire({
        title: 'Logged Out!',
        text: 'See you again soon!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      }).then(() => {
        // 3. Redirect to login
        this.router.navigate(['/login']);
      });
    }
  });
}
}