import { TestBed } from '@angular/core/testing';

import { VanderService } from './vander.service';

describe('VanderService', () => {
  let service: VanderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VanderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
