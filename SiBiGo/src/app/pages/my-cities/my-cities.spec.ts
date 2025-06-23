import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCities } from './my-cities';

describe('MyCities', () => {
  let component: MyCities;
  let fixture: ComponentFixture<MyCities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
