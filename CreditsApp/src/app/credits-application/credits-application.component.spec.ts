import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsApplicationComponent } from './credits-application.component';

describe('CreditsApplicationComponent', () => {
  let component: CreditsApplicationComponent;
  let fixture: ComponentFixture<CreditsApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditsApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
