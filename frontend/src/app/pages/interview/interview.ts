import { Component, effect, inject, input, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InterviewService } from './interview.service';
import { JobService } from '../dashboard/jobService';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule, MatExpansionPanelTitle } from '@angular/material/expansion';
import { InterviewQuestion, QAItem } from '../../types';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.html',
  styleUrls: ['./interview.css'],  
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatListModule,
    MatExpansionPanelTitle, 
    MatExpansionModule
  ]
})
export class InterviewComponent {
  job_id = input(''); 
  isGenerating = false;
  isSaving = true;
  questions: QAItem[] = [];

  form = inject(FormBuilder).nonNullable.group({
    resumeText: ['', Validators.required],
    jobDescription: ['', Validators.required],
    jobTitle: ['',Validators.required]
  });  
  private service = inject(InterviewService);
  private router = inject(Router);
  private jobService = inject(JobService);

  constructor() {
    effect(() => {
      if (!this.job_id) {
      return;   
    }   
    this.jobService.get_by_id(this.job_id()).subscribe(response => {
      console.log(response.data);
        if (response.data) {
          this.form.patchValue(response.data);                   
     } 
    })
    });
  }  

  generateQuestions() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const { resumeText, jobDescription } = this.form.value;
  if (resumeText && jobDescription) {
    this.isGenerating = true;
    this.service.generateQuestions(resumeText, jobDescription).subscribe({
      next: (res) => {
        this.questions = res.data?.questions ?? [];       
        this.isSaving = this.questions.length === 0;
        this.isGenerating = false;
      },
      error: (err) => {
        console.error('Error generating questions:', err);
        this.isSaving = true;
        this.isGenerating = false;
      }
    });
  }
}

  onSubmit():void {
    if (this.questions.length === 0) return;    
    if(!this.form.value.jobDescription){
      return
    }
      
      const payload :Partial< InterviewQuestion> = {
      
      job: {
        jobId: this.job_id(),
      jobTitle: this.form.value.jobTitle || '',
      },      
      questions: this.questions,
    };
    
      this.service.saveQuestions(payload).subscribe({
      next: () => {
        this.router.navigate(['','jobs', 'dashboard']);
      },
      error: (err) => {
        console.error('Error saving questions:', err);
      }
    });
  }
  

  onCancel(): void {
    this.router.navigate(['', 'jobs', 'dashboard']);
  }
}
