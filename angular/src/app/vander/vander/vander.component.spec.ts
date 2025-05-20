import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanderComponent } from './vander.component';

describe('VanderComponent', () => {
  let component: VanderComponent;
  let fixture: ComponentFixture<VanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
