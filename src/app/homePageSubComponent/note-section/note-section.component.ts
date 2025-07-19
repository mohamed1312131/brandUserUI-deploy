import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-note-section',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './note-section.component.html',
  styleUrls: ['./note-section.component.css']
})
export class NoteSectionComponent implements OnInit {
  activeNote: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/notes/active`).subscribe({
      next: (notes) => {
        if (notes && notes.length > 0) {
          this.activeNote = notes[0];
        }
      },
      error: err => console.error('Failed to load notes', err)
    });
  }
}
