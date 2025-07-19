import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  subscribe(): void {
    if (this.form.invalid || this.isSubmitting) return;

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
