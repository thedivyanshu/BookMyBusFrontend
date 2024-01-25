import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllUsersComponentComponent } from './view-all-users-component.component';

describe('ViewAllUsersComponentComponent', () => {
  let component: ViewAllUsersComponentComponent;
  let fixture: ComponentFixture<ViewAllUsersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllUsersComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllUsersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
