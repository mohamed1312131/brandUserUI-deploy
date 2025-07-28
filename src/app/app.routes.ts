import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { FAQComponent } from './homePageSubComponent/faq/faq.component';
import { ContactUsComponent } from './homePageSubComponent/contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ThankYouComponent } from './homePageSubComponent/thank-you/thank-you.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'shop',
        component: ShopListComponent
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: 'checkout',
        component: CheckOutComponent
      },
      {
        path: 'confirm-order',
        component: ConfirmOrderComponent
      },
      {
        path:'faq',
        component: FAQComponent
      },
      {
        path:'contact',
        component: ContactUsComponent
      },
      {
        path:'about',
        component: AboutUsComponent
      },
      {
        path: 'thank-you',
        component:ThankYouComponent
      },

      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
      
    ]
  }
];