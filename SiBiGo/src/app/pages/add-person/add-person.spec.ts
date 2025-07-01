import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPerson } from './add-person';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddPerson', () => {
  let component: AddPerson;
  let fixture: ComponentFixture<AddPerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPerson],
      imports: [FormsModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPerson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});