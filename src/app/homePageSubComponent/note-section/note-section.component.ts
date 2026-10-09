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
import { Router, RouterModule } from '@angular/router';

interface NoteButton {
  text: string;
  external: boolean;
  url?: string;
  path?: string;
  queryParams?: Record<string, any>;
  fragment?: string;
}

const DEFAULT_TEXT: Record<string, string> = {
  SHOP: 'Shop Now',
  INQUIRY: 'Book an Inquiry',
  CUSTOM: 'Learn More'
};

@Component({
  selector: 'app-note-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './note-section.component.html',
  styleUrls: ['./note-section.component.css']
})
export class NoteSectionComponent implements OnInit {
  activeNote: any = null;
  button: NoteButton | null = null;
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
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
            this.button = this.buildButton(this.activeNote);
          }
        },
        error: err => console.error('Failed to load notes', err)
      });
    }
  }

  // Notes saved before button settings existed have no buttonType and keep the original Shop Now button.
  private buildButton(note: any): NoteButton | null {
    const type: string = note.buttonType || 'SHOP';
    if (type === 'NONE') return null;
    const text = note.buttonText || DEFAULT_TEXT[type] || DEFAULT_TEXT['SHOP'];

    if (type === 'INQUIRY') return { text, external: false, path: '/client-inquiry-form' };
    if (type !== 'CUSTOM') return { text, external: false, path: '/shop' };

    const url: string = note.buttonUrl || '';
    if (url.startsWith('https://')) return { text, external: true, url };
    if (!url.startsWith('/') || url.startsWith('//')) return null;

    const tree = this.router.parseUrl(url);
    return {
      text,
      external: false,
      path: '/' + (tree.root.children['primary']?.segments.map(s => s.path).join('/') ?? ''),
      queryParams: tree.queryParams,
      fragment: tree.fragment ?? undefined
    };
  }
}
