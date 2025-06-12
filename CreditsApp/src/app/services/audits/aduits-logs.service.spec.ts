import { TestBed } from '@angular/core/testing';

import { AduitsLogsService } from './aduits-logs.service';

describe('AduitsLogsService', () => {
  let service: AduitsLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AduitsLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
