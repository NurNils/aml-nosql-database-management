import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IResponseStatus } from './interfaces/response.interface';
import { AuthService } from './services/auth/auth.service';
import { LanguageService } from './services/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /** Constructor */
  constructor(
    private router: Router,
    languageService: LanguageService,
    private authService: AuthService
  ) {
    languageService.initializeI18n();
    this.authenticate();
  }

  /** Authenticate user */
  async authenticate() {
    const res = await this.authService.authenticate();
    if (res.status === IResponseStatus.success && res.data?.usernameOrEmail) {
      this.authService.usernameOrEmail = res.data.usernameOrEmail;
      if (this.router.isActive('/login', true)) {
        this.router.navigateByUrl('/').then();
      }
    }
  }
}
