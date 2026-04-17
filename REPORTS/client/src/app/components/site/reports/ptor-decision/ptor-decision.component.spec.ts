import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtorDecisionComponent } from './ptor-decision.component';

describe('PtorDecisionComponent', () => {
  let component: PtorDecisionComponent;
  let fixture: ComponentFixture<PtorDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PtorDecisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtorDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
