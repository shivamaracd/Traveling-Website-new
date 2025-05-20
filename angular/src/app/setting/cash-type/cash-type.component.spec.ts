import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTypeComponent } from './cash-type.component';

describe('CashTypeComponent', () => {
  let component: CashTypeComponent;
  let fixture: ComponentFixture<CashTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
