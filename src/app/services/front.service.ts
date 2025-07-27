import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductListDTO {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  sizes: string[];
  colors: string[];
  price: number;
  stockLeft: number;
  sold: number;
  category: string;
}

interface Variant {
  variantId: string;
  color: string;
  images: string[];
  sizes: { size: string; stock: number }[];
}

interface ProductDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  additionalInfo?: string;
  variants: Variant[];
}

export interface OrderedProduct {
  productId: string;
  quantity: number;
  size?: string; // optional, based on backend entity
}

export interface CheckoutPayload {
  firstName: string;
  lastName: string;
  region: string;     // <-- required: matches `region` in backend
  city: string;
  address: string;
  zipCode: string;    // <-- matches backend field name
  phone: string;
  email: string;
  note?: string;
  products: OrderedProduct[];
}
export interface Carousel {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  status: boolean;
  createdAt: string;
}


@Injectable({
  providedIn: 'root'
})
export class FrontService {
  private readonly BASE_URL = `${environment.apiUrl}/products`;
  private readonly ORDER_URL = `${environment.apiUrl}/orders`;
  private readonly CAROUSEL_URL = `${environment.apiUrl}/carousels`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ProductListDTO[]> {
    return this.http.get<ProductListDTO[]>(this.BASE_URL);
  }

    getProductDetails(id: string): Observable<ProductDetails> {
      return this.http.get<ProductDetails>(`${this.BASE_URL}/${id}`);
    }
  placeOrder(payload: CheckoutPayload): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.ORDER_URL}/place`, payload, { headers });
}
  getActive(): Observable<Carousel[]> {
    return this.http.get<Carousel[]>(`${this.CAROUSEL_URL}/active`);
  }
}
