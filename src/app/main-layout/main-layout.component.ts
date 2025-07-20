import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser, CommonModule } from '@angular/common';

import { CartSideBarComponent } from '../homePageSubComponent/cart-side-bar/cart-side-bar.component';
import { FooterComponent } from '../homePageSubComponent/footer/footer.component';
import { InstagramSectionComponent } from '../homePageSubComponent/instagram-section/instagram-section.component';
import { NavBarComponent } from '../homePageSubComponent/nav-bar/nav-bar.component';
import { NewsLetterSectionComponent } from '../homePageSubComponent/news-letter-section/news-letter-section.component';
import { SearchPopupComponent } from '../homePageSubComponent/search-popup/search-popup.component';

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
export class MainLayoutComponent {
  private router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  showOutlet = true;



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
