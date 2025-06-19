import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { InterviewQuestion, QAItem, StandardResponse } from '../../types';
import { environment } from '../../environments/enviornment';

@Injectable({
   providedIn: 'root' 
  })
export class InterviewService {

  http = inject(HttpClient);

  generateQuestions(resume: string, jobDescription: string) {
  return this.http.post<StandardResponse<{questions: QAItem[]}>>(environment.BACKEND_URL + '/jobs/generateInterview',{resume, jobDescription } );
}

saveQuestions(data: Partial <InterviewQuestion>) {
 
  return this.http.post<StandardResponse<{questions: QAItem[]}>>(
    environment.BACKEND_URL + '/jobs/saveInterview/'+data.job?.jobId, data );
}

   
}