import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePinComponent } from './note-pin.component';

describe('NotePinComponent', () => {
  let component: NotePinComponent;
  let fixture: ComponentFixture<NotePinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotePinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotePinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
