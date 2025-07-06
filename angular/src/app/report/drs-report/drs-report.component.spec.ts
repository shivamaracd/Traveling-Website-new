import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrsReportComponent } from './drs-report.component';

describe('DrsReportComponent', () => {
  let component: DrsReportComponent;
  let fixture: ComponentFixture<DrsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
