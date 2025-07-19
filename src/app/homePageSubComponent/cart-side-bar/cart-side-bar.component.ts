import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cartService';

@Component({
  selector: 'app-cart-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-side-bar.component.html',
  styleUrl: './cart-side-bar.component.css'
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
    item.variantId, // Add this parameter
    item.size, 
    item.color, 
    item.quantity + 1
  );
}

decreaseQty(item: CartItem): void {
  if (item.quantity > 1) {
    this.cartService.updateQuantity(
      item.productId, 
      item.variantId, // Add this parameter
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
    item.variantId, // Add this parameter
    item.size, 
    item.color
  );
}



  closeCart(): void {
    if (this.isBrowser) {
      import('bootstrap').then(bootstrap => {
        const cart = document.getElementById('offcanvasCart');
        if (cart) {
          const offcanvas = bootstrap.Offcanvas.getInstance(cart);
          offcanvas?.hide();
        }
      });
    }
  }

  goToCheckout(): void {
    this.closeCart(); // Optionally close cart before navigating
    this.router.navigate(['/checkout']);
  }

}
