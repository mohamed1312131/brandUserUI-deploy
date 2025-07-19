import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import AOS from 'aos';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-our-service',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './our-service.component.html',
  styleUrl: './our-service.component.css'
})
export class OurServiceComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        once: true,
        duration: 800
      });

      AOS.refresh();
    }
  }
}
