import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="language-selector">
      <select 
        [ngModel]="selectedLanguage" 
        (ngModelChange)="changeLanguage($event)"
        class="bg-gray-700 text-white rounded px-2 py-1 text-sm">
        <option *ngFor="let lang of languages" [value]="lang.code">
          {{ lang.name }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    .language-selector {
      display: inline-block;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  languages: { code: string, name: string }[] = [];
  selectedLanguage: string = 'en';

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.languages = this.languageService.availableLanguages;
    this.languageService.currentLanguage$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }

  changeLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
  }
} 