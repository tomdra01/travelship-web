import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePinComponent } from './date-pin.component';

describe('DatePinComponent', () => {
  let component: DatePinComponent;
  let fixture: ComponentFixture<DatePinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatePinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
