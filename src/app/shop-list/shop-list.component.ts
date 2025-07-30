import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FrontService, ProductListDTO } from '../services/front.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {
  products: ProductListDTO[] = [];
  filteredProducts: ProductListDTO[] = [];
  displayedProducts: ProductListDTO[] = [];

  categories: string[] = [];
  sizes: string[] = [];
  colors: string[] = [];

  selectedCategory = '';
  selectedSize = '';
  selectedColor = '';
  selectedSort = '';
  heroImageUrl: string | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Mobile filter sidebar
  isMobileFilterOpen = false;

  private isProductLoaded = false;
  private pendingCategory: string | null = null;

  constructor(
    private frontService: FrontService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.frontService.getActive().subscribe({
    next: (data) => {
      if (data && data.length > 0) {
        this.heroImageUrl = data[0].imageUrl;
      }
    },
    error: (err) => console.error('Error loading hero image', err)
  });
    // Handle query param change for `category`
    this.route.queryParamMap.subscribe(params => {
      const category = params.get('category');
      if (this.isProductLoaded) {
        this.selectedCategory = category || '';
        this.applyFilters();
      } else {
        this.pendingCategory = category;
      }
    });

    this.frontService.getAllProducts().subscribe(data => {
      this.products = data;

      this.categories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
      this.sizes = Array.from(new Set(data.flatMap(p => p.sizes || [])));
      this.colors = Array.from(new Set(data.flatMap(p => p.colors || [])));

      this.isProductLoaded = true;

      if (this.pendingCategory !== null) {
        this.selectedCategory = this.pendingCategory;
        this.pendingCategory = null;
      }

      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const categoryMatch = !this.selectedCategory || product.category === this.selectedCategory;
      const sizeMatch = !this.selectedSize || (product.sizes?.includes(this.selectedSize) ?? false);
      const colorMatch = !this.selectedColor || (product.colors?.includes(this.selectedColor) ?? false);
      return categoryMatch && sizeMatch && colorMatch;
    });

    this.currentPage = 1;
    this.applySorting();
  }

  applySorting(): void {
    switch (this.selectedSort) {
      case 'color':
        this.filteredProducts.sort((a, b) =>
          (a.colors?.[0] || '').localeCompare(b.colors?.[0] || '')
        );
        break;
      case 'size':
        this.filteredProducts.sort((a, b) =>
          (a.sizes?.[0] || '').localeCompare(b.sizes?.[0] || '')
        );
        break;
      case 'price':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
    }

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedSize = '';
    this.selectedColor = '';
    this.selectedSort = '';
    this.currentPage = 1;
    this.filteredProducts = [...this.products];
    this.updatePagination();
  }

  // Mobile filter methods
  openMobileFilter(): void {
    this.isMobileFilterOpen = true;
    document.body.classList.add('filter-open');
  }

  closeMobileFilter(): void {
    this.isMobileFilterOpen = false;
    document.body.classList.remove('filter-open');
  }

  applyAndCloseMobileFilter(): void {
    this.applyFilters();
    this.closeMobileFilter();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onSizeChange() {
    this.applyFilters();
  }

  onColorChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applySorting();
  }
}