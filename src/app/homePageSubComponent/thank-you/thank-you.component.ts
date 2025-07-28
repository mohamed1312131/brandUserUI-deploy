import { Component, OnInit } from '@angular/core';
import { FrontService, Carousel } from '../../services/front.service';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.css'
})
export class ThankYouComponent implements OnInit {
  firstImageUrl: string = '';

  constructor(private carouselService: FrontService) {}

  ngOnInit(): void {
    this.carouselService.getActive().subscribe((data: Carousel[]) => {
      if (data && data.length > 0) {
        // Adjust property name if your Carousel type uses a different field
        this.firstImageUrl = data[0].imageUrl;
      }
    });
  }
}