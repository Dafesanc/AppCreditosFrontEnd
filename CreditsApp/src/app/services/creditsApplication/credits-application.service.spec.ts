import { TestBed } from '@angular/core/testing';

import { CreditsApplicationService } from './credits-application.service';

describe('CreditsApplicationService', () => {
  let service: CreditsApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditsApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
