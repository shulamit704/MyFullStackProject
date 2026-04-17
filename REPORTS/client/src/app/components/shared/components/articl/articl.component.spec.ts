import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlComponent } from './articl.component';

describe('ArticlComponent', () => {
  let component: ArticlComponent;
  let fixture: ComponentFixture<ArticlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
