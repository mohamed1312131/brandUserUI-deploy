import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import AOS from 'aos';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, MatIconModule, MatButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {
  activeCategories: any[] = [];
  cartCount: number = 0;
  logoUrl: string = '../../assets/images/lighthamzalogoo.png'; // fallback
  isBrowser: boolean;
  
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Initialize AOS only on browser
    if (this.isBrowser) {
      AOS.init({ 
        duration: 800, 
        once: true,
        disable: 'mobile' // Disable on mobile for better performance
      });
      
      this.fetchWebsiteInfo();
      this.fetchActiveCategories();
    }
    
    // Subscribe to cart changes (works on both server and browser)
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Delay AOS refresh to ensure DOM is ready
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchWebsiteInfo(): void {
    this.http.get<any>(`${environment.apiUrl}/website`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (webinfo) => {
          if (webinfo?.logo) {
            this.logoUrl = webinfo.logo;
          }
        },
        error: (err) => {
          console.error('Failed to fetch website info:', err);
          // Keep the fallback logo
        }
      });
  }

  private fetchActiveCategories(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categories/active`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.activeCategories = data || [];
          
          // Refresh AOS after categories are loaded
          if (this.isBrowser) {
            setTimeout(() => AOS.refresh(), 0);
          }
        },
        error: (err) => {
          console.error('Failed to fetch categories:', err);
          this.activeCategories = [];
        }
      });
  }

  goToCategory(category: string): void {
    if (!category) return;
    
    // Close any open Bootstrap modals/offcanvas
    if (this.isBrowser) {
      // Close offcanvas if open
      const offcanvasElement = document.getElementById('offcanvasNavbar');
      if (offcanvasElement) {
        const offcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(offcanvasElement);
        if (offcanvas) {
          offcanvas.hide();
        }
      }
    }
    
    // Navigate with a small delay to allow offcanvas to close
    setTimeout(() => {
      this.router.navigate(['/shop'], { 
        queryParams: { category },
        queryParamsHandling: 'merge' // Preserve other query params if needed
      });
    }, 200);
  }

  // Method to close mobile menu programmatically
  closeMobileMenu(): void {
    if (this.isBrowser) {
      const offcanvasElement = document.getElementById('offcanvasNavbar');
      if (offcanvasElement) {
        const offcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(offcanvasElement);
        if (offcanvas) {
          offcanvas.hide();
        }
      }
    }
  }

  // Method to handle navigation with menu closing
  navigateAndCloseMenu(route: string[]): void {
    this.closeMobileMenu();
    setTimeout(() => {
      this.router.navigate(route);
    }, 200);
  }
}