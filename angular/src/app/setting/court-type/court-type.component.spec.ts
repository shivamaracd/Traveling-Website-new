import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtTypeComponent } from './court-type.component';

describe('CourtTypeComponent', () => {
  let component: CourtTypeComponent;
  let fixture: ComponentFixture<CourtTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourtTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
