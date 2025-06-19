import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../dashboard/jobService';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { matchJobData } from '../../types';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-update-job-application-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-job-application-form.html',
  styleUrl: './update-job-application-form.scss'
})
export class UpdateJobApplicationForm { 
  #router = inject(Router);
  #jobService = inject(JobService);
  #snackBar = inject(MatSnackBar);
  #fb = inject(FormBuilder);

  job_id = input('');  
  feedback: matchJobData | null = null;
  isScanning = false;
  
  jobApplicationForm = this.#fb.nonNullable.group({
    _id:"",
    jobTitle: ['', Validators.required],
    company: ['', Validators.required],
    jobDescription: ['', Validators.required],
    jobURL: ['', Validators.required],
    application_Date: [new Date()],
    location: [''],
    salary: [null],
    status: ['Applied'],
    notes: [''],
    resumeText: [''],      
  });  

  constructor() {    
    effect(() => {
      console.log("********effect******"+ this.job_id());
      if(!this.job_id()){
        return
      }
      this.#jobService.get_by_id(this.job_id()).subscribe(response=>{
        console.log(response.data);
        this.jobApplicationForm.patchValue(response.data)  
        if (response.data.feedback) {
          const validFeedback: matchJobData = {
            matchPercentage: Number(response.data.feedback.matchPercentage),
            strengths: response.data.feedback.strengths || [],
            weaknesses: response.data.feedback.weaknesses || [],
            suggestions: response.data.feedback.suggestions || []
          };
          this.feedback = validFeedback;
        } else {
          this.feedback = null;
        }
      })     
    });    
  }

  scanMatch(): void {
    const jd = this.jobApplicationForm.value.jobDescription;
    const resume = this.jobApplicationForm.value.resumeText;

    if (!jd || !resume) {
      this.#snackBar.open('Please provide job description and resume.', 'Close', { duration: 3000 });
      return;
    }

    this.isScanning = true;
    this.#jobService.addJobScan({ jobDescription: jd, resume }).subscribe({
      next: (res) => {
        this.isScanning = false;
        if (res.success && res.data) {
          this.feedback = res.data;          
          this.#snackBar.open('Scan successful!', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.isScanning= false;
        this.#snackBar.open('Scan failed.', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
   
    if (this.jobApplicationForm.invalid || !this.feedback || !this.job_id()) {
      this.#snackBar.open('Please complete the form and run scan.', 'Close', { duration: 3000 });
      return;
    }

    
    const payload = {
      ...this.jobApplicationForm.value,
      feedback: this.feedback,
    };
    
    this.#jobService.update(payload).subscribe({
      next: () => {
        this.#snackBar.open('Application Saved!', 'Close', { duration: 3000 });
        this.jobApplicationForm.reset();
        this.feedback = null;
        this.#router.navigate(['', 'jobs', 'dashboard']);        
      },
      error: () => {
        this.#snackBar.open('Failed to save application.', 'Close', { duration: 3000 });        
      }
      
    });
  }

  onCancel(): void {
    this.#router.navigate(['', 'jobs', 'dashboard']);
  }
}