import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Job, matchJobData, QAItem, QAResponse, ScanRequest, StandardResponse, Token } from '../../types';
import { environment } from '../../environments/enviornment';
import { parse5 } from '@angular/cdk/schematics';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JobService {

  #http = inject(HttpClient);

  add(data: Partial<Job>) {
    console.log(data);
    return this.#http.post<StandardResponse<Job>>(environment.BACKEND_URL + '/jobs', data);
  }
  addJobScan(data: ScanRequest) {
    return this.#http.post<StandardResponse<matchJobData>>(environment.BACKEND_URL + '/jobs/scan', data);
  }

  delete(_id: string) {
    return this.#http.delete<StandardResponse<number>>(environment.BACKEND_URL + '/jobs/' + _id);
  }
  get_by_id(_id: string) {
    return this.#http.get<StandardResponse<Job>>(environment.BACKEND_URL + '/jobs/' + _id);
  }

  update(job: Partial<Job>) {
    return this.#http.put<StandardResponse<number>>(environment.BACKEND_URL + '/jobs/' + job._id, job);
  }

  list = this.#http.get<StandardResponse<Job[]>>(environment.BACKEND_URL + '/jobs');  

  getInterviewQuestions(jobTitle: string, jobDescription: string): Observable<StandardResponse<QAResponse>> {
    const payload = { jobTitle, jobDescription };
    return this.#http.post<StandardResponse<QAResponse>>(environment.BACKEND_URL+"/:jobId/interview-questions", payload);
  }

  saveInterviewQA(jobId: string, jobTitle: string, questions: QAItem[]): Observable<StandardResponse<any>> {
    const payload = {
      jobId,
      jobTitle,
      questions,
    };
    return this.#http.post<StandardResponse<QAResponse>>(environment.BACKEND_URL+"/:jobId/interview-questions", payload);
  }

 ;
}



