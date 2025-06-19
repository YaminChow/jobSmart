import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard";
import { JobApplicationCreateComponent } from "../job-application-matching/job-application-matching";
// import { Update } from "./update";

export const jobRoutes: Routes = [
  { path: 'dashboard', component: Dashboard, title: 'List Job Application' },
  { path: 'add', component: JobApplicationCreateComponent, title: 'Add a new job application' },
//   { path: 'update/:job_id', component: Update, title: 'Update a Job Application' },
];
