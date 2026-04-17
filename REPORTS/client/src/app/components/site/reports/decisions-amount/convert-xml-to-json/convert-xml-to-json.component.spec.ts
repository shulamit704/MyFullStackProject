import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertXmlToJsonComponent } from './convert-xml-to-json.component';

describe('ConvertXmlToJsonComponent', () => {
  let component: ConvertXmlToJsonComponent;
  let fixture: ComponentFixture<ConvertXmlToJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConvertXmlToJsonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertXmlToJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
