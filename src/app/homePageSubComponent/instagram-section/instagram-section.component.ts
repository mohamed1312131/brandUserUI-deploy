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

@Component({
  selector: 'app-instagram-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instagram-section.component.html',
  styleUrls: ['./instagram-section.component.css']
})
export class InstagramSectionComponent implements OnInit {
  instagramUrl: string = 'https://www.instagram.com'; // fallback
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.http.get<any>(`${environment.apiUrl}/website`).subscribe({
        next: (data) => {
          this.instagramUrl = data?.instagramUrl || this.instagramUrl;
        },
        error: (err) => console.error('Failed to fetch Instagram URL', err)
      });
    }
  }
}
