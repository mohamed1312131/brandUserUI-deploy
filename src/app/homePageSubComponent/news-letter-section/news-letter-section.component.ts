import {
  Component,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-news-letter-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './news-letter-section.component.html',
  styleUrl: './news-letter-section.component.css'
})
export class NewsLetterSectionComponent {
  form: FormGroup;
  isSubmitting = false;
  isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  subscribe(): void {
    if (this.form.invalid || this.isSubmitting || !this.isBrowser) return;

    this.isSubmitting = true;

    const email = this.form.value.email.trim().toLowerCase();
    const params = new HttpParams().set('email', email);

    this.http.post(`${environment.apiUrl}/newsletter/subscribe`, null, { params }).subscribe({
      next: () => {
        this.snackBar.open('Subscribed successfully!', 'Close', { duration: 3000 });
        this.form.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        const msg = err.status === 409 ? 'You are already subscribed.' : 'Subscription failed. Try again.';
        this.snackBar.open(msg, 'Close', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }
}
