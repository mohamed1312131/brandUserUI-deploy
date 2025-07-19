// checkout-state.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {
  private checkoutFormData: any = null;

  setFormData(data: any) {
    this.checkoutFormData = data;
  }

  getFormData() {
    return this.checkoutFormData;
  }

  clear() {
    this.checkoutFormData = null;
  }
}
