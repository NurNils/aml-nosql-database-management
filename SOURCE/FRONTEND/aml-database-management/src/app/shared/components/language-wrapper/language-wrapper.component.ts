import { Component } from '@angular/core';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-language-wrapper',
  templateUrl: './language-wrapper.component.html',
  styleUrls: ['./language-wrapper.component.scss'],
})
export class LanguageWrapperComponent {
  /** Constructor */
  constructor(public languageService: LanguageService) {}
}
