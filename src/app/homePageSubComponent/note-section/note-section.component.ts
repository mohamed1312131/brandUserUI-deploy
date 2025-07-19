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

@Component({
  selector: 'app-note-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './note-section.component.html',
  styleUrls: ['./note-section.component.css']
})
export class NoteSectionComponent implements OnInit {
  activeNote: any = null;
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
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
}
