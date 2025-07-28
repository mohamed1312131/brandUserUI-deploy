import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../services/cartService';
import { CheckoutPayload, FrontService } from '../services/front.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,MatSnackBarModule],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css'
})
export class ConfirmOrderComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: FrontService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s'-]{2,30}$/)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s'-]{2,30}$/)]
      ],
      region: ['', Validators.required],
      city: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s'-]{2,40}$/)]
      ],
      address: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      state: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s'-]{2,40}$/)]
      ],
      zipCode: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]{3,10}$/)]
      ],
      phone: [
  '',
  [Validators.required, Validators.pattern(/^\d{8}$/)]
],
      email: ['', [Validators.required, Validators.email]],
      note: ['']
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      if (this.cartItems.length === 0) {
        this.router.navigate(['/']);
      }
      this.cdr.detectChanges();
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getGrandTotal(): number {
    return this.getTotal() + 8;
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const formData = this.checkoutForm.value;

    const payload: CheckoutPayload = {
      ...formData,
      products: this.cartItems.map(item => ({
        productId: item.productId,
        productName: item.title, // optional if your backend expects this
        size: item.size,
        quantity: item.quantity
      })),
      total: this.getTotal(),
      grandTotal: this.getGrandTotal()
    };

    this.checkoutService.placeOrder(payload).subscribe({
      next: response => {
        console.log('Order placed:', response);
        this.cartService.clearCart();

        // 1. Open the snackbar and keep a reference to it
        const snackBarRef = this.snackBar.open(
          '🎉 Commande validée ! Redirection en cours...', 
          'OK', 
          {
            duration: 5000, // Show for 5 seconds as requested
            panelClass: ['modern-toast'],
            verticalPosition: 'top',
            horizontalPosition: 'center' // Centered feels more modern
          }
        );

        // 2. Navigate ONLY after the toast is dismissed (either by timer or click)
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/']);
        });
      },
      error: err => {
        console.error('Failed to place order', err);
        this.snackBar.open('❌ Une erreur est survenue. Veuillez réessayer.', 'Fermer', {
          duration: 5000,
          panelClass: ['error-toast'],
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.isSubmitting = false;
      }
    });
  }
}
