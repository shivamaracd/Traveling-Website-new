import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBookingComponent } from './import-booking.component';

describe('ImportBookingComponent', () => {
  let component: ImportBookingComponent;
  let fixture: ComponentFixture<ImportBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
