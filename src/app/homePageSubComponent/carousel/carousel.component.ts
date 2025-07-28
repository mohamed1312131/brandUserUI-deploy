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

  @ViewChild('swiperWrapper', { static: false }) swiperWrapper!: ElementRef;

  constructor(
    private carouselService: FrontService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Only fetch data if we're on the browser
    if (this.isBrowser) {
      this.carouselService.getActive().subscribe((data) => {
        this.carousels = data;
      });
    }
  }

 ngAfterViewInit(): void {
  if (!this.isBrowser) return;

  const waitForRender = setInterval(() => {
    const wrapper = this.swiperWrapper?.nativeElement;
    const slides = wrapper?.querySelectorAll('.swiper-slide') || [];
    const arrowsReady =
      document.querySelector('.icon-arrow-left') &&
      document.querySelector('.icon-arrow-right');

    if (slides.length > 0 && arrowsReady) {
      clearInterval(waitForRender);
      this.initSwiper();
    }
  }, 100);
}


  initSwiper(): void {
    if (!this.isBrowser || !this.carousels.length) return;

    if (this.swiper) {
      this.swiper.update();
      return;
    }

    this.swiper = new Swiper('.angular-slideshow', {
  navigation: {
    nextEl: '.icon-arrow-right',
    prevEl: '.icon-arrow-left',
  }
});
  }
}
