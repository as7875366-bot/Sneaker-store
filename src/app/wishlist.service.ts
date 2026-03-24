import { inject, Injectable } from '@angular/core';
import { CartService } from './cartservices.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
private usersessionkey = 'currentuser'
private cartservice = inject(CartService)

private getWishlistKey(): string {
    const user = JSON.parse(localStorage.getItem(this.usersessionkey) || '{}');
    return user.email ? `wishlist_${user.email}` : 'wishlist_guest';
  }

  // Get all items
  getWishlistItems(): any[] {
    const key = this.getWishlistKey();
    const list = localStorage.getItem(key);
    return list ? JSON.parse(list) : [];
  }

  // Add to wishlist
  addToWishlist(product: any) {
    let list = this.getWishlistItems();
    const exists = list.find((item: any) => item.id === product.id);
    
    if (!exists) {
      list.push(product);
      localStorage.setItem(this.getWishlistKey(), JSON.stringify(list));
      return { success: true, message: `${product.name} added to Wishlist! 💖` };
    } else {
      return { success: false, message: "Already in Wishlist!" };
    }
  }

  // Remove from wishlist
  removeFromWishlist(productId: number) {
    let list = this.getWishlistItems().filter((item: any) => item.id !== productId);
    localStorage.setItem(this.getWishlistKey(), JSON.stringify(list));
  }

  // Move item from Wishlist to Cart
  moveWishlistToCart(product: any) {
    this.cartservice.addToCart(product); // Cart service use karein
    this.removeFromWishlist(product.id);
  }
}
