import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swiper from 'swiper';
import 'swiper/css';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../../services/cartService';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-arrival',
  standalone: true,
  imports: [RouterModule,CommonModule, MatIconModule],
  templateUrl: './new-arrival.component.html',
  styleUrls: ['./new-arrival.component.css']
})
export class NewArrivalComponent implements OnInit {
  newProducts: any[] = [];

  constructor(private http: HttpClient,public cartService:CartService) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/products/latest`).subscribe({
      next: (data) => {
        this.newProducts = data;
        console.log('New arrivals:', this.newProducts);
        setTimeout(() => {
          new Swiper('.product-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.icon-arrow-right',
              prevEl: '.icon-arrow-left'
            },
            breakpoints: {
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 }
            }
          });
        }, 0);
      },
      error: (err) => console.error('Error fetching new arrivals', err)
    });
  }
  addToCart(product: any): void {
  const item: CartItem = {
    productId: product.id,
    variantId: product.variants?.[0]?.id || 'default',
    title: product.title,
    price: product.price,
    color: product.colors?.[0] || 'Default',
    size: product.sizes?.[0] || 'M',
    quantity: 1,
    thumbnail: product.thumbnail
  };

  this.cartService.addToCart(item);

  // Optionally open the cart sidebar (Bootstrap offcanvas)
  const cartEl = document.getElementById('offcanvasCart');
  if (cartEl) {
    import('bootstrap').then(bootstrap => {
      const offcanvas = new bootstrap.Offcanvas(cartEl);
      offcanvas.show();
    });
  }
}

}
