import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FrontService, Carousel } from '../../services/front.service';

import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
  carousels: Carousel[] = [];
  isBrowser: boolean;

  constructor(
    private carouselService: FrontService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.carouselService.getActive().subscribe({
      next: (data) => {
        this.carousels = data;

        setTimeout(() => {
          new Swiper('.carousel-swiper', {
            loop: true,
            speed: 1000,
            pagination: {
              el: '.carousel-swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.carousel-arrow-right',
              prevEl: '.carousel-arrow-left'
            }
          });
        }, 0);
      },
      error: (err) => console.error('Error loading carousel', err)
    });
  }
}
