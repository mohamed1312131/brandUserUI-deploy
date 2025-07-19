import { Component, AfterViewInit } from '@angular/core';
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

  ngAfterViewInit(): void {
    AOS.init({
      once: true,         // Optional: animations happen only once per element
      duration: 800       // Optional: animation duration in ms
    });

    // Or just refresh in case AOS is already initialized
    AOS.refresh();
  }
}
