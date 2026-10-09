import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { environment } from '../../environments/environment';

interface Option {
  value: string;
  label: string;
}

function notInPast(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return control.value < todayIso() ? { pastDate: true } : null;
}

function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-client-inquiry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-inquiry.component.html',
  styleUrls: ['./client-inquiry.component.css']
})
export class ClientInquiryComponent {
  readonly contactMethods: Option[] = [
    { value: 'EMAIL', label: 'Email' },
    { value: 'WHATSAPP', label: 'WhatsApp' },
    { value: 'PHONE_CALL', label: 'Phone call' }
  ];

  readonly appointmentTypes: Option[] = [
    { value: 'IN_PERSON', label: 'In-person' },
    { value: 'VIRTUAL', label: 'Virtual' }
  ];

  readonly interests: Option[] = [
    { value: 'STANDARD_SIZE', label: 'Ordering a standard size (2-3 months)' },
    { value: 'CUSTOMIZED_DRESS', label: 'Ordering a customized dress (3-5 months)' },
    { value: 'SAMPLE_PURCHASE', label: 'Purchasing a sample' }
  ];

  readonly minDate = todayIso();

  form: FormGroup;
  isSubmitting = false;
  submitted = false;
  errorMessage = '';
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      phone: ['', Validators.maxLength(40)],
      preferredContactMethod: [''],
      eventDate: ['', notInPast],
      appointmentDatePreference: ['', notInPast],
      appointmentTypes: this.fb.group({ IN_PERSON: [false], VIRTUAL: [false] }),
      interest: [''],
      stylesOfInterest: ['', Validators.maxLength(2000)],
      discoverySource: ['', Validators.maxLength(2000)],
      workingWithStylist: [''],
      stylistName: ['', Validators.maxLength(120)],
      website: ['']
    });
  }

  get withStylist(): boolean {
    return this.form.get('workingWithStylist')?.value === 'YES';
  }

  isInvalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && control.touched;
  }

  onSubmit(): void {
    if (this.isSubmitting || !this.isBrowser) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.http.post(`${environment.apiUrl}/inquiries`, this.buildPayload()).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitted = true;
        this.form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.status === 400
          ? 'Please check the information you entered and try again.'
          : 'Something went wrong. Please try again later.';
      }
    });
  }

  private buildPayload() {
    const v = this.form.value;
    const types = v.appointmentTypes as Record<string, boolean>;
    const stylist = v.workingWithStylist === 'YES' ? true : v.workingWithStylist === 'NO' ? false : null;

    return {
      name: v.name,
      email: v.email,
      phone: v.phone || null,
      preferredContactMethod: v.preferredContactMethod || null,
      eventDate: v.eventDate || null,
      appointmentDatePreference: v.appointmentDatePreference || null,
      appointmentTypes: Object.keys(types).filter(key => types[key]),
      interest: v.interest || null,
      stylesOfInterest: v.stylesOfInterest || null,
      discoverySource: v.discoverySource || null,
      workingWithStylist: stylist,
      stylistName: stylist ? v.stylistName || null : null,
      website: v.website || null
    };
  }
}
