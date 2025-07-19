import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cartService';
import AOS from 'aos';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  activeCategories: any[] = [];
  cartCount: number = 0;
  logoUrl: string = '../../assets/images/lighthamzalogoo.png'; // Default logo path

  constructor(private http: HttpClient, private router: Router, private cartService: CartService) {}
ngAfterViewInit(): void {
    AOS.init({
      once: true,         // Optional: animations happen only once per element
      duration: 800       // Optional: animation duration in ms
    });

    // Or just refresh in case AOS is already initialized
    AOS.refresh();
  }
  
  ngOnInit(): void {
  AOS.init({ duration: 800, once: true });

  // Fetch webinfo to get logo
  this.http.get<any>(`${environment.apiUrl}/website`).subscribe({
    next: (webinfo) => {
      if (webinfo && webinfo.logo) {
        this.logoUrl = webinfo.logo;
      }
    },
    error: (err) => {
      console.error('Failed to fetch webinfo', err);
      // Keep default logo on error
    }
  });

  this.http.get<any[]>(`${environment.apiUrl}/categories/active`).subscribe({
    next: (data) => {
      this.activeCategories = data;
      setTimeout(() => AOS.refresh(), 0); // Ensure AOS applies to newly loaded content
    },
    error: (err) => console.error('Failed to fetch categories', err)
  });

  this.cartService.cartItems$.subscribe(items => {
    this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  });
}


  goToCategory(category: string): void {
    this.router.navigate(['/shop'], { queryParams: { category } });
  }
}
