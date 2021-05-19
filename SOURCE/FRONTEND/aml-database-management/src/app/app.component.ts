import { Component } from '@angular/core';
import { ApiService } from './services/api/api.service';
import { LanguageService } from './services/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /** Only for testing -> Check if user is logged in */
  public login: boolean = false;

  /** Constructor */
  constructor(languageService: LanguageService, private apiService: ApiService) {
    languageService.initializeI18n();

    this.authorize();
  }

  /** Authorize user */
  async authorize() {
    const res = await this.apiService.login();
  }
}