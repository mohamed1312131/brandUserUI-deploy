import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { filter } from 'rxjs/operators';

import { RouterOutlet } from '@angular/router';
import { CartSideBarComponent } from '../homePageSubComponent/cart-side-bar/cart-side-bar.component';
import { FooterComponent } from '../homePageSubComponent/footer/footer.component';
import { InstagramSectionComponent } from '../homePageSubComponent/instagram-section/instagram-section.component';
import { NavBarComponent } from '../homePageSubComponent/nav-bar/nav-bar.component';
import { NewsLetterSectionComponent } from '../homePageSubComponent/news-letter-section/news-letter-section.component';
import { SearchPopupComponent } from '../homePageSubComponent/search-popup/search-popup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    SearchPopupComponent,
    CartSideBarComponent,
    NewsLetterSectionComponent,
    InstagramSectionComponent,
    FooterComponent,
    CommonModule
  ],
  template: `
    <div class="homepage">
      <app-search-popup></app-search-popup>
      <app-cart-side-bar></app-cart-side-bar>
      <app-nav-bar></app-nav-bar>

      <router-outlet *ngIf="showOutlet"></router-outlet>

      <app-news-letter-section></app-news-letter-section>
      <app-instagram-section></app-instagram-section>
      <app-footer></app-footer>
    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient); // ✅ Inject HttpClient
  showOutlet = true;

  ngOnInit(): void {
    this.http.post(`${environment.apiUrl}/orders/track`, {}).subscribe();
  }

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/') {
          this.showOutlet = false;
          setTimeout(() => this.showOutlet = true, 0);
        }
      });
  }
}
