import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.css'
})
export class ProductDescriptionComponent {
  @Input() additionalInfo: string | undefined;
  @Input() sizeGuide: string | undefined;
}
