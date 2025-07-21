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
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cartService';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import AOS from 'aos';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, MatIconModule, MatButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, AfterViewInit {
  activeCategories: any[] = [];
  cartCount: number = 0;
  logoUrl: string = '../../assets/images/lighthamzalogoo.png'; // fallback
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Initialize AOS once
      AOS.init({ duration: 800, once: true });
      
      // Fetch website info
      this.http.get<any>(`${environment.apiUrl}/website`).subscribe({
        next: (webinfo) => {
          if (webinfo?.logo) {
            this.logoUrl = webinfo.logo;
          }
        },
        error: (err) => {
          console.error('Failed to fetch webinfo', err);
        }
      });
      
      // Fetch active categories
      this.http.get<any[]>(`${environment.apiUrl}/categories/active`).subscribe({
        next: (data) => {
          this.activeCategories = data;
          setTimeout(() => AOS.refresh(), 0);
        },
        error: (err) => console.error('Failed to fetch categories', err)
      });
    }
    
    // This can be safely run on both server and browser
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      AOS.refresh(); // safe refresh after view init
    }
  }

  goToCategory(category: string): void {
    this.router.navigate(['/shop'], { queryParams: { category } });
  }
}