import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPerson } from './edit-person';

describe('EditPerson', () => {
  let component: EditPerson;
  let fixture: ComponentFixture<EditPerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPerson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPerson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
