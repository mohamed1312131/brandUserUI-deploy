import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FrontService, Carousel } from '../../services/front.service';
import { MatIconModule } from '@angular/material/icon';

// Import Swiper
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css'; // optional if not already included via global styles

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

  @ViewChild('swiperWrapper', { static: false }) swiperWrapper!: ElementRef;

  constructor(private carouselService: FrontService) {}

  ngOnInit(): void {
    this.carouselService.getActive().subscribe((data) => {
      this.carousels = data;

      // Wait for DOM to update before initializing swiper
      setTimeout(() => {
        this.initSwiper();
      }, 0);
    });
  }

  ngAfterViewInit(): void {
    // Swiper should not be initialized here if carousels are loaded asynchronously
  }

  initSwiper(): void {
    if (!this.swiper && this.swiperWrapper) {
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
    } else {
      this.swiper?.update();
    }
  }
}
