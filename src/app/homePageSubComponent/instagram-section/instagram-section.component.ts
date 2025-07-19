import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instagram-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instagram-section.component.html',
  styleUrls: ['./instagram-section.component.css']
})
export class InstagramSectionComponent implements OnInit {
  instagramUrl: string = 'https://www.instagram.com/'; // fallback

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/website`).subscribe({
      next: (data) => {
        this.instagramUrl = data.instagramUrl || this.instagramUrl;
      },
      error: (err) => console.error('Failed to fetch Instagram URL', err)
    });
  }
}
