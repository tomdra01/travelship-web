import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPinComponent } from './flight-pin.component';

describe('FlightPinComponent', () => {
  let component: FlightPinComponent;
  let fixture: ComponentFixture<FlightPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightPinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
