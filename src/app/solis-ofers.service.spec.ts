import { TestBed } from '@angular/core/testing';

import { SolisOfersService } from './services/solis-ofers.service';

describe('SolisOfersService', () => {
  let service: SolisOfersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolisOfersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
