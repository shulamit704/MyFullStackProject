import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelRatesComponent } from './fuel-rates.component';

describe('FuelRatesComponent', () => {
  let component: FuelRatesComponent;
  let fixture: ComponentFixture<FuelRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuelRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
