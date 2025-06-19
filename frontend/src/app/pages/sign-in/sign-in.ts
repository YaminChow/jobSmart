import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../users/userService';
import { Router } from '@angular/router';
import { Token } from '../../types';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl:'./sign-in.scss'
})
export class SignInComponent {  
  #userService = inject(UserService);
  #router = inject(Router);

  signInForm = inject(FormBuilder).nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  constructor() {
    if (this.#userService.isLoggedIn()) {
      this.#router.navigate(['', 'jobs', 'dashboard']);
    }
  }

  get email() { return this.signInForm.controls.email; }
  get password() { return this.signInForm.controls.password; }

  
 onSubmit() {
  this.#userService.signin(this.signInForm.value).subscribe({
    next: (response) => {
      const token = response?.data?.accessToken;

      if (!token) {
        console.error('No token in response:', response);
        alert('Login failed.');
        return;
      }

      const decoded_token = JSON.parse(atob(token.split('.')[1])) as Token;
      this.#userService.token.set(token);
      this.#userService.user.set(decoded_token);
      this.#router.navigate(['', 'jobs', 'dashboard']);
    },
    error: (err) => {
      console.error('Login failed:', err);
      alert('Login failed.');
    }
  });
}

goToSignUp() {
    this.#router.navigate(['','signup']);
  }

}