import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import Swiper from 'swiper';
import 'swiper/css';
import * as AOS from 'aos';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tag-serction',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './tag-serction.component.html',
  styleUrls: ['./tag-serction.component.css']
})
export class TagSerctionComponent implements OnInit, AfterViewInit {
  activeCategories: any[] = [];
  isBrowser: boolean;

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

          setTimeout(() => {
            this.initSwiperIfNeeded();
            AOS.init({ once: true, duration: 800 });
            AOS.refresh();
          }, 0);
        },
        error: (err) => console.error('Failed to fetch active categories', err)
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      AOS.refresh();
    }
  }

  private initSwiperIfNeeded(): void {
    if (this.isBrowser && this.activeCategories.length > 3) {
      new Swiper('.tag-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
          nextEl: '.icon-arrow-right',
          prevEl: '.icon-arrow-left'
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
