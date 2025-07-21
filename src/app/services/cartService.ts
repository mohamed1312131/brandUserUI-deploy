import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  thumbnail: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }

  private saveCartToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  private loadCartFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          this.cartItems = JSON.parse(saved);
          this.cartSubject.next([...this.cartItems]);
        } catch (e) {
          console.error('Failed to parse cart from localStorage:', e);
          this.cartItems = [];
        }
      }
    }
  }

  addToCart(item: CartItem): void {
    // Use variantId, productId, and size for unique identification
    const existing = this.cartItems.find(i =>
      i.productId === item.productId &&
      i.variantId === item.variantId &&
      i.size === item.size &&
      i.color === item.color
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cartItems.push({ ...item });
    }

    this.cartSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  updateQuantity(productId: string, variantId: string, size: string, color: string, quantity: number): void {
    console.log('Update Request:', { productId, variantId, size, color, quantity });
    
    const item = this.cartItems.find(i =>
      i.productId === productId &&
      i.variantId === variantId &&
      i.size === size &&
      i.color === color
    );

    if (item) {
      console.log('Item before update:', item);
      item.quantity = quantity;
      console.log('Item after update:', item);
      this.cartSubject.next([...this.cartItems]);
      this.saveCartToStorage();
    } else {
      console.warn('Matching item NOT found!');
    }
    console.log('Final cart:', this.cartItems);
  }

  removeItem(productId: string, variantId: string, size: string, color: string): void {
    this.cartItems = this.cartItems.filter(i =>
      !(i.productId === productId && 
        i.variantId === variantId && 
        i.size === size && 
        i.color === color)
    );
    this.cartSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cart');
    }
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }
}