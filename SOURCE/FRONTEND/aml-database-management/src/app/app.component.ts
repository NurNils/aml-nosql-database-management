import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment as env } from '../environments/environment';
import { LanguageService } from './services/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /** Constructor */
  constructor(languageService: LanguageService) {
    languageService.initializeI18n();
  }
}
