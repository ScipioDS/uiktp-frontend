import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationAddDialogue } from './location-add-dialogue';

describe('LocationAddDialogue', () => {
  let component: LocationAddDialogue;
  let fixture: ComponentFixture<LocationAddDialogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationAddDialogue],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationAddDialogue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
