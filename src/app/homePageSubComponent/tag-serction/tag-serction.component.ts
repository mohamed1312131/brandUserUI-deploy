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
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import * as AOS from 'aos';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tag-serction',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './tag-serction.component.html',
  styleUrls: ['./tag-serction.component.css']
})
export class TagSerctionComponent implements OnInit, OnDestroy {
  activeCategories: any[] = [];
  isBrowser: boolean;
  currentIndex = 0;
  autoSlideInterval: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.http.get<any[]>(`${environment.apiUrl}/categories/active`).subscribe({
        next: (data) => {
          this.activeCategories = data;
          AOS.init({ once: true, duration: 800 });
          this.startAutoSlide();
        },
        error: (err) => console.error('Failed to fetch active categories', err)
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
  }

  startAutoSlide(): void {
    if (this.activeCategories.length > 3) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.activeCategories.length;
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.activeCategories.length) % this.activeCategories.length;
  }

  isActive(index: number): boolean {
    return index === this.currentIndex;
  }
}
