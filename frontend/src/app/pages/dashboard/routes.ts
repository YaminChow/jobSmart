import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard";
import { JobApplicationCreateComponent } from "../job-application-matching/job-application-matching";
import { UpdateJobApplicationForm } from "../update-job-application-form/update-job-application-form";
import { InterviewComponent } from "../interview/interview";

export const jobRoutes: Routes = [
  { path: 'dashboard', component: Dashboard, title: 'List Job Application' },
  { path: 'add', component: JobApplicationCreateComponent, title: 'Add a new job application' },
  { path: 'edit/:job_id', component: UpdateJobApplicationForm, title: 'Update a Job Application' },
  { path: 'interview/:job_id', component:InterviewComponent, title: 'Interview Question And Answer'  } 
  
];


