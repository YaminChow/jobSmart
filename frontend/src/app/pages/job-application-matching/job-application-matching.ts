import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JobService } from '../dashboard/jobService';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { matchJobData } from '../../types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-job-application-create',
  templateUrl: './job-application-matching.html',
  styleUrls: ['./job-application-matching.scss'],
  standalone: true,
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
  ]
})
export class JobApplicationCreateComponent {
  #snackBar = inject(MatSnackBar);
  #router = inject(Router);
  #jobService = inject(JobService);

  isScanning = false;
  isSaving = true;

  jobApplicationForm = inject(FormBuilder).nonNullable.group({
    jobTitle: ['', Validators.required],
    company: ['', Validators.required],
    jobDescription: ['', Validators.required],   
    jobURL: ['', Validators.required],
    application_Date: [new Date()],
    location: [''],
    salary: [null, Validators.min(0)],
    status: ['Applied', Validators.required],
    notes: [''],
    resumeText: ['', Validators.required],     
  });

  feedback: matchJobData | null = null;

  scanMatch(): void {
    if (this.jobApplicationForm.controls.resumeText.value?.trim().length === 0) {
      this.#snackBar.open('Please enter resume to scan.', 'Close', { duration: 3000 });
      return;
    }

    if (this.jobApplicationForm.controls.jobDescription.value?.trim().length === 0) {
      this.#snackBar.open('Please enter job description to scan.', 'Close', { duration: 3000 });
      return;
    }
    this.isScanning = true;

    const jd = this.jobApplicationForm.controls.jobDescription.value;
    const resume = this.jobApplicationForm.controls.resumeText.value;

    this.#jobService.addJobScan({ jobDescription: jd, resume: resume }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.feedback = res.data;
          this.#snackBar.open('Scan completed successfully!', 'Close', { duration: 3000 });
        } else {
          this.#snackBar.open('Scan failed to return results.', 'Close', { duration: 3000 });
        }
        this.isScanning = false;
        this.isSaving = false;
      },
      error: () => {
        this.#snackBar.open('Failed to perform scan.', 'Close', { duration: 3000 });
        this.isScanning = false;
      }
    });
  }

  onSubmit(): void {
    if (this.jobApplicationForm.invalid || !this.feedback) {
      this.#snackBar.open('Fill required fields and run scan first.', 'Close', { duration: 3000 });
      return;
    }

    const payload = {
      ...this.jobApplicationForm.value,
      feedback: this.feedback,
    };
    
    this.#jobService.add(payload).subscribe({
      next: () => {
        this.#snackBar.open('Application Saved!', 'Close', { duration: 3000 });
        this.jobApplicationForm.reset();
        this.feedback = null;
        this.#router.navigate(['', 'jobs', 'dashboard']);
        this.isSaving = false;
      },
      error: () => {
        this.#snackBar.open('Failed to save application.', 'Close', { duration: 3000 });
        this.isSaving = false;
      }
      
    });
  }

  onCancel(): void {
    this.jobApplicationForm.reset();
    this.feedback = null;
    this.#router.navigate(['', 'jobs', 'dashboard']);
  }
}

