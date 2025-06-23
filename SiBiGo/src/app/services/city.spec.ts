import { TestBed } from '@angular/core/testing';

import { City } from './city';

describe('City', () => {
  let service: City;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(City);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
