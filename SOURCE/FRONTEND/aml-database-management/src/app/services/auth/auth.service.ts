import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Username or Email */
  public usernameOrEmail: string;

  /** Constructor */
  constructor(private apiService: ApiService) {}

  /** Get username or email */
  getUsernameOrEmail() {
    return this.usernameOrEmail;
  }

  /** Authenticate */
  async authenticate() {
    return await this.apiService.get('authenticate');
  }

  /** Login */
  async login(usernameOrEmail: string, password: string) {
    return await this.apiService.post('login', {
      usernameOrEmail,
      password,
    });
  }

  /** Logout */
  async logout() {
    return await this.apiService.get('logout');
  }
}
