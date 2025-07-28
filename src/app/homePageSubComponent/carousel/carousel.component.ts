import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FrontService, Carousel } from '../../services/front.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {
  carousels: Carousel[] = [];
  currentIndex = 0;
  intervalId: any;
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
        this.startAutoSlide();
      },
      error: (err) => console.error('Error loading carousel', err)
    });
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.carousels.length;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.carousels.length) % this.carousels.length;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carousels.length;
  }
}
