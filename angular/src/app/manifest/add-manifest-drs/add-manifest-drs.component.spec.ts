import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManifestDrsComponent } from './add-manifest-drs.component';

describe('AddManifestDrsComponent', () => {
  let component: AddManifestDrsComponent;
  let fixture: ComponentFixture<AddManifestDrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManifestDrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManifestDrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
