import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  phone: string = '';
  email: string = '';
  location: string = '';
  instagramUrl: string = '';
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/website`).subscribe({
      next: (data) => {
        this.phone = data.phone;
        this.email = data.email;
        this.location = data.location;
        this.instagramUrl = data.instagramUrl;
      },
      error: (err) => {
        console.error('Failed to load contact info', err);
      }
    });
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

