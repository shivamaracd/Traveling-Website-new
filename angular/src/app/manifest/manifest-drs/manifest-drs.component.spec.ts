import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestDrsComponent } from './manifest-drs.component';

describe('ManifestDrsComponent', () => {
  let component: ManifestDrsComponent;
  let fixture: ComponentFixture<ManifestDrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManifestDrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManifestDrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
