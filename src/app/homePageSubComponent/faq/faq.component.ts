import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { FrontService, Carousel } from '../../services/front.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FAQComponent implements OnInit {
  isBrowser: boolean;
  faqs: any[] = [];
  heroImage: string | null = null;

  constructor(
    private http: HttpClient,
    private frontService: FrontService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
  if (this.isBrowser) {
    // Load FAQs
    this.http.get<any[]>(`${environment.apiUrl}/faqs`).subscribe({
      next: (data) => this.faqs = data,
      error: (err) => console.error('Failed to load FAQs', err)
    });

    // Load first active carousel image
    this.frontService.getActive().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.heroImage = data[0].imageUrl; // ✅ Correct field name
        }
      },
      error: (err) => console.error('Failed to load carousel image', err)
    });
  }
}
}
