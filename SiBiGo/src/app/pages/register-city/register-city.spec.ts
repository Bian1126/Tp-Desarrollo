import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCity } from './register-city';

describe('RegisterCity', () => {
  let component: RegisterCity;
  let fixture: ComponentFixture<RegisterCity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
