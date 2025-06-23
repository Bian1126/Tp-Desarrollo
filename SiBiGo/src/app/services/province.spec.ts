import { TestBed } from '@angular/core/testing';

import { Province } from './province';

describe('Province', () => {
  let service: Province;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Province);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
