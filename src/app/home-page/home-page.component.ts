import { Component } from '@angular/core';
import { SearchPopupComponent } from "../homePageSubComponent/search-popup/search-popup.component";
import { CarouselComponent } from '../homePageSubComponent/carousel/carousel.component';
import { OurServiceComponent } from "../homePageSubComponent/our-service/our-service.component";
import { TagSerctionComponent } from "../homePageSubComponent/tag-serction/tag-serction.component";
import { NewArrivalComponent } from "../homePageSubComponent/new-arrival/new-arrival.component";
import { NoteSectionComponent } from "../homePageSubComponent/note-section/note-section.component";
import { BestSellingComponent } from "../homePageSubComponent/best-selling/best-selling.component";
import { VideoSectionComponent } from "../homePageSubComponent/video-section/video-section.component";
import { NewsLetterSectionComponent } from "../homePageSubComponent/news-letter-section/news-letter-section.component";
import { InstagramSectionComponent } from "../homePageSubComponent/instagram-section/instagram-section.component";
import { FooterComponent } from "../homePageSubComponent/footer/footer.component";
import { CartSideBarComponent } from "../homePageSubComponent/cart-side-bar/cart-side-bar.component";
import { NavBarComponent } from "../homePageSubComponent/nav-bar/nav-bar.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchPopupComponent, CarouselComponent, OurServiceComponent, TagSerctionComponent, NewArrivalComponent, NoteSectionComponent, BestSellingComponent, VideoSectionComponent, NewsLetterSectionComponent, InstagramSectionComponent, FooterComponent, CartSideBarComponent, NavBarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
