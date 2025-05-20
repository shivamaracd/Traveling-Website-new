import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashStatusComponent } from './cash-status.component';

describe('CashStatusComponent', () => {
  let component: CashStatusComponent;
  let fixture: ComponentFixture<CashStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
