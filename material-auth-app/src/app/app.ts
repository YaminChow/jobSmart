import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Initial_State } from './types';
import { UserService } from './users/userService';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
 
 
    <router-outlet />`,
  styles: []
})
export class App {
  protected title = 'Job Smart Application';
  userService = inject(UserService);
  #router = inject(Router);
  logout() {
    this.userService.token.set('');
    this.userService.user.set(Initial_State);
    this.#router.navigate(['', 'signin']);
  }
}
