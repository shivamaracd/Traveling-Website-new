import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwordByComponent } from './forword-by.component';

describe('ForwordByComponent', () => {
  let component: ForwordByComponent;
  let fixture: ComponentFixture<ForwordByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwordByComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwordByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
