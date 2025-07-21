import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cartService';

// Import MatIconModule for Angular Material Icons
import { MatIconModule } from '@angular/material/icon'; 

@Component({
  selector: 'app-cart-side-bar',
  standalone: true,
  // Add MatIconModule to your imports array
  imports: [CommonModule, RouterModule, MatIconModule], 
  templateUrl: './cart-side-bar.component.html',
  // Use styleUrls to link to the separate CSS file
  styleUrls: ['./cart-side-bar.component.css'] 
})
export class CartSideBarComponent implements OnInit {
  cartItems: CartItem[] = [];
  isBrowser: boolean;

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

  increaseQty(item: CartItem): void {
    this.cartService.updateQuantity(
      item.productId,
      item.variantId,
      item.size,
      item.color,
      item.quantity + 1
    );
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(
        item.productId,
        item.variantId,
        item.size,
        item.color,
        item.quantity - 1
      );
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(
      item.productId,
      item.variantId,
      item.size,
      item.color
    );
  }

  closeCart(): void {
    if (this.isBrowser) {
      import('bootstrap').then(bootstrap => {
        const cart = document.getElementById('offcanvasCart');
        if (cart) {
          const instance = bootstrap.Offcanvas.getInstance(cart) || new bootstrap.Offcanvas(cart);
          instance.hide();
        }
      }).catch(err => {
        console.warn('Failed to load bootstrap for offcanvas:', err);
      });
    }
  }

  goToCheckout(): void {
    this.closeCart();
    this.router.navigate(['/checkout']);
  }
}