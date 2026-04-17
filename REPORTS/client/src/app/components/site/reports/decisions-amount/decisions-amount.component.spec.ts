import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionsAmountComponent } from './decisions-amount.component';

describe('DecisionsAmountComponent', () => {
  let component: DecisionsAmountComponent;
  let fixture: ComponentFixture<DecisionsAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionsAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionsAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
