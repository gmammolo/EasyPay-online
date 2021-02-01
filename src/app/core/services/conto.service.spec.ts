import { TestBed } from '@angular/core/testing';

import { ContoService } from './conto.service';

describe('ContoService', () => {
  let service: ContoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
