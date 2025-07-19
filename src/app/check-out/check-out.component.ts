import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../services/cartService';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CheckoutStateService } from '../services/CheckoutStateService';
@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService,private router: Router,private checkoutState: CheckoutStateService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      console.log('Cart items on checkout:', this.cartItems);
    });
  }
increaseQty(item: CartItem) {
  this.cartService.updateQuantity(
    item.productId,
    item.variantId,
    item.size,
    item.color,
    item.quantity + 1
  );
}

decreaseQty(item: CartItem) {
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

removeItem(item: CartItem) {
  this.cartService.removeItem(
    item.productId,
    item.variantId,
    item.size,
    item.color
  );
}

getTotal(): number {
  return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

clearCart() {
  this.cartService.clearCart();
}
goToConfirm() {
  this.router.navigate(['/confirm-order']);
}




}
