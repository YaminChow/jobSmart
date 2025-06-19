import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../users/userService';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp {
  #userService = inject(UserService);
  signUpForm = inject(FormBuilder).nonNullable.group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  #router = inject(Router);

  get fullname() { return this.signUpForm.controls.fullname; }
  get email() { return this.signUpForm.controls.email; }
  get password() { return this.signUpForm.controls.password; }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { fullname, email, password } = this.signUpForm.value;
    console.log('Registering user:', { fullname, email, password });
    const data_to_submit = new FormData();
    data_to_submit.append('fullname', this.fullname.value);
    data_to_submit.append('email', this.email.value);
    data_to_submit.append('password', this.password.value);   

    this.#userService.signup(data_to_submit).subscribe(response => {
      console.log(response.data);
      this.#router.navigate(['', 'signin']);
    });



    // Mock success alert
    alert('Account created successfully!');

    // Example: redirect to sign-in
    this.#router.navigate(['','signin']);
  }
  goToSignIn():void{
    this.#router.navigate(['','signin']);
  }

}