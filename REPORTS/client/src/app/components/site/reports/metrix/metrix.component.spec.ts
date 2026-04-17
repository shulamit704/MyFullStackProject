import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetrixComponent } from './metrix.component';

describe('MetrixComponent', () => {
  let component: MetrixComponent;
  let fixture: ComponentFixture<MetrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
