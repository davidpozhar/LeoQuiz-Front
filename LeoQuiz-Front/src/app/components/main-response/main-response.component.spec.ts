import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainResponseComponent } from './main-response.component';

describe('MainResponseComponent', () => {
  let component: MainResponseComponent;
  let fixture: ComponentFixture<MainResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
