import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cartservices.service'; // Path verify karein
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addtocart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './addtocart.component.html',
  styleUrls: ['./addtocart.component.css']
})
export class AddtocartComponent implements OnInit {
  cartItems: any[] = [];
  subtotal: number = 0;

  // Modern injection method
  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    // 1. Service se items laao (Guest ya User dono ke liye chalega)
    this.cartItems = this.cartService.getCartItems();
    
    // 2. Subtotal calculate karo
    this.calculateTotal();
    
    console.log("Cart Items Loaded:", this.cartItems);
  }

  calculateTotal() {
    this.subtotal = this.cartService.getSubtotal();
  }

  // Cart se item delete karna
removeItem(id: number) {
  Swal.fire({
    title: 'Remove Item?',
    text: "Kya aap is item ko cart se hatana chahte hain?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',   // Delete button red
    cancelButtonColor: '#3085d6',  // Cancel button blue
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // 1. Service se item remove karein
      this.cartService.removeFromCart(id);
      
      // 2. List ko refresh karein
      this.loadCart();

      // 3. Stylish Success Toast
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      Toast.fire({
        icon: 'success',
        title: 'Item removed from cart'
      });
    }
  });
}

  // Quantity control: Badhane ke liye
  increaseQty(item: any) {
    item.quantity = (item.quantity || 1) + 1;
    this.cartService.updateCart(this.cartItems);
    this.calculateTotal();
  }

  // Quantity control: Kam karne ke liye
  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(this.cartItems);
      this.calculateTotal();
    } else {
      this.removeItem(item.id);
    }
  }

  // Checkout sirf tab maange jab user Buy kare
  onCheckout() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      alert("Please login to complete your order!");
      this.router.navigate(['/check-out']);
    } else {
      // Order place karne ki logic
      this.cartService.placeOrder({
        orderId: 'ORD' + Date.now(),
        items: this.cartItems,
        total: this.subtotal
      });
      alert("Order Placed Successfully!");
      this.router.navigate(['/home']);
    }
  }
}