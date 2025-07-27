import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { LinebreaksPipe } from '../../linebreaks.pipe';



@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, LinebreaksPipe],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  aboutTitle: string = '';
  aboutDescription: string = '';
  aboutImageUrl: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/website`).subscribe({
      next: (info) => {
        this.aboutTitle = info.aboutUs?.title || '';
        this.aboutDescription = info.aboutUs?.description || '';
        this.aboutImageUrl = info.aboutUs?.imageUrl || '';
      },
      error: (err) => {
        console.error('Failed to load About Us info:', err);
      }
    });
  }
}
