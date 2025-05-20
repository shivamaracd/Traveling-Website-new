import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVanderComponent } from './add-vander.component';

describe('AddVanderComponent', () => {
  let component: AddVanderComponent;
  let fixture: ComponentFixture<AddVanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVanderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
