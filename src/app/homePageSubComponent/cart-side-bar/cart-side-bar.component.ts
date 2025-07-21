import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cartService';

@Component({
  selector: 'app-cart-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-side-bar.component.html',
  styleUrls: ['./cart-side-bar.component.css'] // Use styleUrls instead of styleUrl
})
export class CartSideBarComponent implements OnInit {
  cartItems: CartItem[] = [];
  isBrowser: boolean;
  freeShippingThreshold: number = 200; // Example: Free shipping over 200 TND

  constructor(
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // New: Calculate how much is left for free shipping
  getFreeShippingDifference(): number {
    const total = this.getTotal();
    return this.freeShippingThreshold > total ? this.freeShippingThreshold - total : 0;
  }

  // New: Calculate progress bar percentage
  getShippingProgress(): number {
    const total = this.getTotal();
    if (total >= this.freeShippingThreshold) {
      return 100;
    }
    return (total / this.freeShippingThreshold) * 100;
  }

  increaseQty(item: CartItem): void {
    this.cartService.updateQuantity(item.productId, item.variantId, item.size, item.color, item.quantity + 1);
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.productId, item.variantId, item.size, item.color, item.quantity - 1);
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.productId, item.variantId, item.size, item.color);
  }

  closeCart(): void {
    if (this.isBrowser) {
      import('bootstrap').then(bootstrap => {
        const cartEl = document.getElementById('offcanvasCart');
        if (cartEl) {
          const instance = bootstrap.Offcanvas.getInstance(cartEl) || new bootstrap.Offcanvas(cartEl);
          instance.hide();
        }
      }).catch(err => console.error('Bootstrap dynamic import failed', err));
    }
  }

  goToCheckout(): void {
    this.closeCart();
    this.router.navigate(['/checkout']);
  }
  
  // New: Navigate to products page
  goToShopping(): void {
    this.closeCart();
    this.router.navigate(['/products']);
  }

  // New: trackBy function for ngFor performance
  trackByItemId(index: number, item: CartItem): string {
    return item.variantId;
  }
}