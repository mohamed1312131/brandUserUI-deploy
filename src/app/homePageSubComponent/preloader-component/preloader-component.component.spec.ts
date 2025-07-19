import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloaderComponentComponent } from './preloader-component.component';

describe('PreloaderComponentComponent', () => {
  let component: PreloaderComponentComponent;
  let fixture: ComponentFixture<PreloaderComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreloaderComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreloaderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
