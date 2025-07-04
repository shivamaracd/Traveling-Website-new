import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryImportComponent } from './delivery-import.component';

describe('DeliveryImportComponent', () => {
  let component: DeliveryImportComponent;
  let fixture: ComponentFixture<DeliveryImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
