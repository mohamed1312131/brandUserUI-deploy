import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FrontService, Carousel } from '../../services/front.service';
import { MatIconModule } from '@angular/material/icon';

// Import Swiper
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, AfterViewInit {
  carousels: Carousel[] = [];
  swiper: Swiper | undefined;
  isBrowser: boolean;

  @ViewChild('swiperWrapper', { static: false }) swiperWrapper!: ElementRef;

  constructor(
    private carouselService: FrontService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.carouselService.getActive().subscribe((data) => {
      this.carousels = data;

      if (this.isBrowser) {
        // Ensure DOM is ready before initializing Swiper
        setTimeout(() => {
          this.initSwiper();
        }, 0);
      }
    });
  }

  ngAfterViewInit(): void {
    // Leave empty or use it for browser-only logic if needed
  }

  initSwiper(): void {
    if (this.isBrowser && !this.swiper && this.swiperWrapper) {
      this.swiper = new Swiper('.slideshow', {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.icon-arrow-right',
          prevEl: '.icon-arrow-left'
        }
      });
    } else if (this.swiper) {
      this.swiper.update();
    }
  }
}
