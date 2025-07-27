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
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  logoUrl: string = '';
  description: string = '';
  email: string = '';
  isBrowser: boolean;
  facebookUrl: string = '';
youtubeUrl: string = '';
pinterestUrl: string = '';
threadsUrl: string = '';
instagramUrl: string = '';


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
        this.logoUrl = data?.logoUrl || '';
        this.description = data?.description || '';
        this.email = data?.email || '';
        this.facebookUrl = data?.facebookUrl || '';
        this.youtubeUrl = data?.youtubeUrl || '';
        this.pinterestUrl = data?.pinterestUrl || '';
        this.threadsUrl = data?.threadsUrl || '';
        this.instagramUrl = data?.instagramUrl || '';
      },
      error: (err) => console.error('Failed to load website info for footer', err)
    });
  }
}

}
