import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  /** Available languages */
  languages = [
    {
      lang: 'de',
      country: 'Germany',
      name: 'Deutsch',
    },
    {
      lang: 'en',
      country: 'USA',
      name: 'English',
    },
  ];

  /** Constructor */
  constructor(private translate: TranslateService) {}

  /** Initialize i18n */
  initializeI18n() {
    this.translate.setDefaultLang(env.i18n.defaultLanguage);
    const savedLanguage = localStorage.getItem(env.storage.keys.i18n);
    if (savedLanguage && this.isLangAvailable(savedLanguage)) {
      this.translate.use(savedLanguage);
    } else if (this.isLangAvailable(this.translate.getBrowserLang())) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use(env.i18n.defaultLanguage);
    }
  }

  /** Check if lang is available */
  isLangAvailable(lang: string) {
    for (const language of this.getLanguages()) {
      if (language.lang === lang) {
        return true;
      }
    }
    return false;
  }

  /** Get available languages */
  getLanguages() {
    return this.languages;
  }

  /** Checks current language */
  isLanguage(lang: string) {
    return lang === this.translate.currentLang;
  }

  /** Changes the current language */
  changeLanguage(lang: string) {
    localStorage.setItem(env.storage.keys.i18n, lang);
    this.translate.use(lang);
  }
}
