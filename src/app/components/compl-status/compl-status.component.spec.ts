import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplStatusComponent } from './compl-status.component';

describe('ComplStatusComponent', () => {
  let component: ComplStatusComponent;
  let fixture: ComponentFixture<ComplStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
