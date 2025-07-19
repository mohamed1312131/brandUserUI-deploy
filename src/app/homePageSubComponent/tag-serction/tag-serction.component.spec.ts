import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSerctionComponent } from './tag-serction.component';

describe('TagSerctionComponent', () => {
  let component: TagSerctionComponent;
  let fixture: ComponentFixture<TagSerctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagSerctionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagSerctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
