import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { UserService } from '../../users/userService';
import { Initial_State, Job } from '../../types';
import { JobService } from './jobService';

// interface JobApplication {
//   id: number;
//   jobTitle: string;
//   company: string;
//   applicationDate: Date;
//   status: number;
// }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatProgressBarModule,
    MatCardModule,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  #userService = inject(UserService);
  #router = inject(Router);
  jobApplications = signal<Job[]>([]);
  #jobService = inject(JobService);
  
  displayedColumns: string[] = [
    'No',
    'jobTitle',
    'company',
    'location',
    'status',
    'applicationDate',
    'match',
    'actions',
  ];
  
  constructor() {    
    this.#jobService.list.subscribe((response) => {
      this.jobApplications.set(response.data);
      console.log(this.jobApplications);
    });
    
  }

  logout() {
    this.#userService.token.set('');
    this.#userService.user.set(Initial_State);
    this.#router.navigate(['', 'signin']);
  }

  createNewApplication() {
    this.#router.navigate(['/jobs/add']);
  }

  editJob(id: string) {
    this.#router.navigate(['/jobs/edit', id]);
  }

  deleteJob(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this job application?');
    if (confirmDelete) {
      alert(`Deleted job ID: ${id}`);
      // call delete service here
    }
  }

  viewInterview(element: Job) {
    alert(`Viewing interview questions for job: ${element.jobTitle}`);
    this.#router.navigate(['/interview', element._id]);
  }
}
