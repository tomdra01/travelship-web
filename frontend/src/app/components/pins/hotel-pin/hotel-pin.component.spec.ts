import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPinComponent } from './hotel-pin.component';

describe('HotelPinComponent', () => {
  let component: HotelPinComponent;
  let fixture: ComponentFixture<HotelPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelPinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HotelPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
