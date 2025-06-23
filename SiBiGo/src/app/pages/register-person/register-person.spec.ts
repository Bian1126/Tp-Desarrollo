import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPerson } from './register-person';

describe('RegisterPerson', () => {
  let component: RegisterPerson;
  let fixture: ComponentFixture<RegisterPerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPerson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPerson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
