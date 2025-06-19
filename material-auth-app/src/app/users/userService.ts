import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/enviornment';
import { Initial_State, StandardResponse, Token } from '../types';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  #http = inject(HttpClient);
  token = signal(''); // enc token
  user = signal<Token>(Initial_State); // dec token

  constructor() {
    effect(() => {
      localStorage.setItem('token', this.token());
      localStorage.setItem('user', JSON.stringify(this.user()));
    });
  }

  signin(data: Partial<{ email: string, password: string; }>) {
    console.log(environment.BACKEND_URL + '/users/signin');
    return this.#http.post<StandardResponse<{ token: string; }>>(environment.BACKEND_URL + '/users/signin', data);
  }

  signup(data: FormData) {
    return this.#http.post<StandardResponse<string>>(environment.BACKEND_URL + '/users/signup', data);
  }

  isLoggedIn() {
    return this.token() ? true : false;
  }
}
