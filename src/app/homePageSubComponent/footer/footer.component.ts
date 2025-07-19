import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/website`).subscribe({
      next: (data) => {
        this.logoUrl = data.logoUrl;
        this.description = data.description;
        this.email = data.email;
      },
      error: (err) => console.error('Failed to load website info for footer', err)
    });
  }
}
