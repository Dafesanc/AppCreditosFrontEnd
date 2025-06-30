import { TestBed } from '@angular/core/testing';

import { CardsapplicationService } from './cardsapplication.service';

describe('CardsapplicationService', () => {
  let service: CardsapplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsapplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
