import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJobApplicationForm } from './update-job-application-form';

describe('UpdateJobApplicationForm', () => {
  let component: UpdateJobApplicationForm;
  let fixture: ComponentFixture<UpdateJobApplicationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateJobApplicationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateJobApplicationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
