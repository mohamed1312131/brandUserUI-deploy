import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swiper from 'swiper';
import 'swiper/css';
import * as AOS from 'aos'; // Import AOS
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tag-serction',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './tag-serction.component.html',
  styleUrls: ['./tag-serction.component.css']
})
export class TagSerctionComponent implements OnInit, AfterViewInit {
  activeCategories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categories/active`).subscribe({
      next: (data) => {
        this.activeCategories = data;

        // Defer DOM update and initialize Swiper & AOS
        setTimeout(() => {
          this.initSwiperIfNeeded();
          AOS.init();     // ✅ First init (in case first time load)
          AOS.refresh();  // ✅ Refresh (for navigating back)
        }, 0);
      },
      error: (err) => console.error('Failed to fetch active categories', err)
    });
  }

  ngAfterViewInit(): void {
    // Can also do AOS.init() here for static content
  }

  private initSwiperIfNeeded(): void {
    if (this.activeCategories.length > 3) {
      new Swiper('.category-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
          nextEl: '.category-next',
          prevEl: '.category-prev'
        },
        breakpoints: {
          576: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 }
        }
      });
    }
  }
}
