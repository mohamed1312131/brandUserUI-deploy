import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  
  get baseUrl(): string {
    return environment.apiUrl;
  }

  // Convenience methods for common endpoints
  get productsUrl(): string {
    return `${this.baseUrl}/products`;
  }

  get ordersUrl(): string {
    return `${this.baseUrl}/orders`;
  }

  get categoriesUrl(): string {
    return `${this.baseUrl}/categories`;
  }

  get notesUrl(): string {
    return `${this.baseUrl}/notes`;
  }

  get newsletterUrl(): string {
    return `${this.baseUrl}/newsletter`;
  }

  get websiteUrl(): string {
    return `${this.baseUrl}/website`;
  }

  get contactUrl(): string {
    return `${this.baseUrl}/contact`;
  }

  get carouselsUrl(): string {
    return `${this.baseUrl}/carousels`;
  }
}
