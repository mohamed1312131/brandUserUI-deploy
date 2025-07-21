import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MatIconModule,
    ProductDescriptionComponent,
    SuggestedProductsComponent
  ],
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
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private frontService: FrontService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  ngAfterViewInit(): void {
    // Reserved for future view logic — SSR-safe
  }

  ngOnDestroy(): void {
    if (this.isBrowser) this.destroySwiper();
  }

  private loadProduct(): void {
    this.frontService.getProductDetails(this.productId).subscribe(data => {
      this.product = data;
      if (data.variants && data.variants.length > 0) {
        this.selectedVariant = data.variants[0];
      }

      this.cdr.detectChanges();

      if (this.isBrowser) {
        setTimeout(() => this.initSwiper(), 0);
      }
    });
  }

  selectColor(color: string): void {
    if (!this.product || this.selectedVariant?.color === color) return;

    const newVariant = this.product.variants.find(v => v.color === color);
    if (newVariant) {
      this.selectedVariant = newVariant;
      this.cdr.detectChanges();

      if (this.isBrowser) {
        setTimeout(() => this.initSwiper(), 100);
      }
    }
  }

  private updateSwiperSliders(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      if (this.swiperMain && this.swiperThumb) {
        this.swiperThumb.update();
        this.swiperMain.update();
        this.swiperMain.slideTo(0, 0);
      } else {
        this.initSwiper();
      }
    }, 100);
  }

  private initSwiper(): void {
    if (!this.isBrowser) return;
    this.destroySwiper();

    if (!this.selectedVariant?.images?.length) return;

    const isLoopingEnabled = this.selectedVariant.images.length > 4;
    const thumbElement = document.querySelector('.product-thumbnail-slider');
    const mainElement = document.querySelector('.product-large-slider');

    if (!thumbElement || !mainElement) {
      setTimeout(() => this.initSwiper(), 100);
      return;
    }

    try {
      this.swiperThumb = new Swiper('.product-thumbnail-slider', {
        loop: isLoopingEnabled,
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
        loop: isLoopingEnabled,
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

  isColorSelected(color: string): boolean {
    return this.selectedVariant?.color === color;
  }

  trackByImg(index: number, item: string): string {
    return item;
  }

  trackByVariant(index: number, item: Variant): string {
    return item.variantId;
  }

  trackBySize(index: number, item: { size: string; stock: number }): string {
    return item.size;
  }

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
      variantId: this.selectedVariant.variantId,
      title: this.product.title,
      price: this.product.price,
      color: this.selectedVariant.color,
      size: this.selectedSize,
      quantity: this.quantity,
      thumbnail: this.selectedVariant.images[0] || '',
      imageUrl: this.selectedVariant.images[0] || ''
    };

    this.cartService.addToCart(item);

    if (this.isBrowser) {
      import('bootstrap').then(bootstrap => {
        const offcanvas = new bootstrap.Offcanvas('#offcanvasCart');
        offcanvas.show();
      }).catch(err => console.warn('Failed to load Bootstrap Offcanvas:', err));
    }
  }

  increaseQuantity(): void {
    if (this.quantity < 100) this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }
}
