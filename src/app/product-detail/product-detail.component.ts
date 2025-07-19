import { AfterViewInit, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FrontService } from '../services/front.service';
import Swiper from 'swiper';
import { Thumbs, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { MatIconModule } from '@angular/material/icon';
import { ProductDescriptionComponent } from "../product-description/product-description.component";
import { SuggestedProductsComponent } from '../suggested-products/suggested-products.component';

import * as bootstrap from 'bootstrap';
import { CartItem, CartService } from '../services/cartService';
import { FormsModule } from '@angular/forms';
Swiper.use([Thumbs, Pagination, FreeMode]);

interface ProductDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  additionalInfo?: string;
  sizeGuide?: string;
  variants: Variant[];
  category?: string;
}

interface Variant {
  variantId: string;
  color: string;
  images: string[];
  sizes: { size: string; stock: number }[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,FormsModule ,RouterModule, HttpClientModule, MatIconModule, ProductDescriptionComponent,SuggestedProductsComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  productId!: string;
  product?: ProductDetails;
  selectedVariant?: Variant;
  swiperMain?: Swiper;
  swiperThumb?: Swiper;
  selectedSize: string = '';
  quantity: number = 1;
  private swiperInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private frontService: FrontService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  ngAfterViewInit(): void {
    // Swiper initialization is now primarily handled after data loads,
    // but this hook is here for any future view-dependent logic.
  }

  ngOnDestroy(): void {
    this.destroySwiper();
  }

  private loadProduct(): void {
    this.frontService.getProductDetails(this.productId).subscribe(data => {
      this.product = data;
      if (data.variants && data.variants.length > 0) {
        this.selectedVariant = data.variants[0];
      }
      
      // Use ChangeDetectorRef to ensure the view updates with product data
      this.cdr.detectChanges();
      
      // Initialize Swiper after the view has been updated with product images
      // Using a timeout ensures this runs after the current change detection cycle
      setTimeout(() => this.initSwiper(), 0);
    });
  }

selectColor(color: string): void {
  if (!this.product || this.selectedVariant?.color === color) {
    return;
  }
  
  const newVariant = this.product.variants.find(v => v.color === color);
  if (newVariant) {
    this.selectedVariant = newVariant;
    // Tell Angular to update the DOM with the new images
    this.cdr.detectChanges(); 
    
    // Use a timeout. This ensures the new images are rendered on the screen
    // before we try to initialize the new slider.
    setTimeout(() => {
      this.initSwiper();
    }, 100); // A 100ms delay is usually safe.
  }
}


 private updateSwiperSliders(): void {
    // Use a timeout to allow the DOM to update with new slides first
    setTimeout(() => {
      if (this.swiperMain && this.swiperThumb) {
        console.log('Updating Swiper instances.');
        this.swiperThumb.update();
        this.swiperMain.update();
        // Go to the first slide of the new set
        this.swiperMain.slideTo(0, 0); 
      } else {
        // Fallback if Swiper wasn't initialized for some reason
        this.initSwiper();
      }
    }, 100); // A small delay ensures images are rendered.
  }

private initSwiper(): void {
  // 1. Clean up any previous slider instances
  this.destroySwiper();

  // 2. Guard against running if there are no images
  if (!this.selectedVariant?.images?.length) {
    return;
  }

  // 3. Check if the number of images is sufficient for loop mode.
  // We need more slides than slidesPerView (which is 4 on mobile).
  const isLoopingEnabled = this.selectedVariant.images.length > 4;

  console.log(
    `Variant color: ${this.selectedVariant.color}, Images: ${this.selectedVariant.images.length}, Loop mode enabled: ${isLoopingEnabled}`
  );

  const thumbElement = document.querySelector('.product-thumbnail-slider');
  const mainElement = document.querySelector('.product-large-slider');

  if (!thumbElement || !mainElement) {
    console.warn('Swiper target elements not found. Retrying...');
    setTimeout(() => this.initSwiper(), 100);
    return;
  }

  try {
    this.swiperThumb = new Swiper('.product-thumbnail-slider', {
      loop: isLoopingEnabled, // <-- DYNAMICALLY SET
      spaceBetween: 10,
      slidesPerView: 'auto',
      freeMode: true,
      watchSlidesProgress: true,
      direction: 'vertical',
      mousewheel: true,
      breakpoints: {
        0: { direction: 'horizontal', slidesPerView: 4 },
        992: { direction: 'vertical', slidesPerView: 'auto' }
      }
    });

    this.swiperMain = new Swiper('.product-large-slider', {
      loop: isLoopingEnabled, // <-- DYNAMICALLY SET
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      thumbs: {
        swiper: this.swiperThumb,
      },
    });

    this.swiperInitialized = true;
  } catch (error) {
    console.error('Error initializing Swiper:', error);
  }
}

  private destroySwiper(): void {
    if (this.swiperMain) {
      this.swiperMain.destroy(true, true);
      this.swiperMain = undefined;
    }
    if (this.swiperThumb) {
      this.swiperThumb.destroy(true, true);
      this.swiperThumb = undefined;
    }
    this.swiperInitialized = false;
  }

  // Helper method to check if a color is selected
  isColorSelected(color: string): boolean {
    return this.selectedVariant?.color === color;
  }

  // TrackBy functions for better performance
  trackByImg(index: number, item: string): string {
    return item;
  }

  trackByVariant(index: number, item: Variant): string {
    return item.variantId;
  }

  trackBySize(index: number, item: { size: string; stock: number }): string {
    return item.size;
  }

  // Get total stock for selected variant
  getTotalStock(): number {
    if (!this.selectedVariant?.sizes) return 0;
    return this.selectedVariant.sizes.reduce((total, size) => total + size.stock, 0);
  }
addToCart(): void {
  if (!this.product || !this.selectedVariant || !this.selectedSize) {
    alert('Please select a size.');
    return;
  }

  const item: CartItem = {
    productId: this.product.id,
    variantId: this.selectedVariant.variantId, // Add this line
    title: this.product.title,
    price: this.product.price,
    color: this.selectedVariant.color,
    size: this.selectedSize,
    quantity: this.quantity,
    thumbnail: this.selectedVariant.images[0] || ''
  };

  this.cartService.addToCart(item);

  // Optionally open the offcanvas cart
  const offcanvas = new bootstrap.Offcanvas('#offcanvasCart');
  offcanvas.show();
}
increaseQuantity(): void {
  if (this.quantity < 100) {
    this.quantity++;
  }
}

decreaseQuantity(): void {
  if (this.quantity > 1) {
    this.quantity--;
  }
}



}