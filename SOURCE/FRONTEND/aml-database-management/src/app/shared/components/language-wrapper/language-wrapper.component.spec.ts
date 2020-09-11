import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageWrapperComponent } from './language-wrapper.component';

describe('LanguageWrapperComponent', () => {
  let component: LanguageWrapperComponent;
  let fixture: ComponentFixture<LanguageWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageWrapperComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
