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
  domReady = false;

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

      // Mark DOM ready and defer Swiper init to ngAfterViewInit
      if (this.isBrowser) {
        setTimeout(() => {
          this.domReady = true;
          this.initSwiper();
        }, 100); // Delay ensures DOM renders with *ngIf
      }
    });
  }

  ngAfterViewInit(): void {
    // In case data comes late, retry swiper init
    if (this.isBrowser) {
      setTimeout(() => this.initSwiper(), 500);
    }
  }

  initSwiper(): void {
    if (!this.isBrowser || !this.carousels.length) return;

    const wrapper = this.swiperWrapper?.nativeElement;
    if (!wrapper || wrapper.querySelectorAll('.swiper-slide').length === 0) return;

    if (this.swiper) {
      this.swiper.update();
      return;
    }

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
  }
}
