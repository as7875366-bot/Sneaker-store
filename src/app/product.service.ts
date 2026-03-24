import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // LocalStorage Key
  private productstoragekey = "myinventory";

  // Default Data
  private defaultProducts = [
    { id: 1, name: 'UA Curry 3', price: 15500, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', desc: 'Infinite support.', category: 'Shoes' },
    { id: 2, name: 'Nike Air Max', price: 12999, img: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600', desc: 'Classic cushioning.', category: 'Shoes' },
    { id: 3, name: 'Adidas Ultraboost', price: 18000, img: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600', desc: 'Energy-returning Boost.', category: 'Shoes' },
    { id: 4, name: 'Puma RS-X', price: 9500, img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600', desc: 'Retro-inspired design.', category: 'Shoes' },
    { id: 5, name: 'Jordan 1 Retro', price: 22000, img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600', desc: 'The iconic sneaker.', category: 'Shoes' }
  ];

  private productsubject: BehaviorSubject<any[]>;
  products$: Observable<any[]>;

  constructor() {
    const savedProducts = localStorage.getItem(this.productstoragekey);
    const initialProducts = savedProducts ? JSON.parse(savedProducts) : this.defaultProducts;
    
    // Agar pehli baar hai toh defaults save kar dein
    if (!savedProducts) {
      this.syncProductStorage(this.defaultProducts);
    }

    this.productsubject = new BehaviorSubject<any[]>(initialProducts);
    this.products$ = this.productsubject.asObservable();
  }

  // --- Helpers ---
  private syncProductStorage(products: any[]) {
    localStorage.setItem(this.productstoragekey, JSON.stringify(products));
  }

  // --- Admin Methods ---

  // 1. Naya Product Add karna
  addProduct(product: any) {
    const current = this.productsubject.value;
    // Auto-increment ID logic
    product.id = current.length > 0 ? Math.max(...current.map((p: any) => p.id)) + 1 : 1;
    
    const updated = [...current, product];
    this.productsubject.next(updated);
    this.syncProductStorage(updated);
  }

  // 2. Product Delete karna
  deleteProduct(id: number) {
    const updated = this.productsubject.value.filter(p => p.id !== id);
    this.productsubject.next(updated);
    this.syncProductStorage(updated);
  }

  // 3. Product Update/Edit karna
  updateProduct(updatedProd: any) {
    const updatedList = this.productsubject.value.map(p => p.id === updatedProd.id ? updatedProd : p);
    this.productsubject.next(updatedList);
    this.syncProductStorage(updatedList);
  }

  // --- Display Methods ---

  // Sabhi products get karna (Home page ke liye)
  getProducts() { 
    return this.products$; 
  }

  // ID se ek specific product nikalna (Product Detail page ke liye)
  getProductById(id: number) {
    const products = this.productsubject.value;
    return products.find(p => p.id === id);
  }
}