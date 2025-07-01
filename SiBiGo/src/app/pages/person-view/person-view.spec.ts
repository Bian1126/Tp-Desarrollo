import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonView } from './person-view';

describe('PersonView', () => {
  let component: PersonView;
  let fixture: ComponentFixture<PersonView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
