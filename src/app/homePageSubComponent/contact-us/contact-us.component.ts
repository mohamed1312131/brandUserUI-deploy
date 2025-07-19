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
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  phone: string = '';
  email: string = '';
  location: string = '';
  instagramUrl: string = '';
  contactForm: FormGroup;
  isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.http.get<any>(`${environment.apiUrl}/website`).subscribe({
        next: (data) => {
          this.phone = data?.phone || '';
          this.email = data?.email || '';
          this.location = data?.location || '';
          this.instagramUrl = data?.instagramUrl || '';
        },
        error: (err) => {
          console.error('Failed to load contact info', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;

    this.http.post(`${environment.apiUrl}/contact`, this.contactForm.value).subscribe({
      next: () => {
        alert('Message sent successfully!');
        this.contactForm.reset();
      },
      error: () => alert('Failed to send message.')
    });
  }
}
