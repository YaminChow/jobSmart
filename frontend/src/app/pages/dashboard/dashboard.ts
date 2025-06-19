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
    'application_Date',
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
    this.#userService.signout();
    this.#router.navigate(['', 'signin']);
  }

  createNewApplication() {
    this.#router.navigate(['','jobs','add']);
  }

  editJob(job_id: string) {
    console.log("dashbaord_edit*******"+job_id);
    this.#router.navigate(['','jobs','edit', job_id]);
  }

  deleteJob(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this job application?');
    if (confirmDelete) {      
      this.#jobService.delete(id).subscribe(response=>{
      if(response.data===1){
        this.jobApplications.update(jobs=>{
          return jobs.filter(jobs=>jobs._id!==id);
        })
      }
    })
    }   
  }

  viewInterview(element: Job) {    
    this.#router.navigate(['','jobs','interview', element._id]);   
    
  }
}
