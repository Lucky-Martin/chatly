import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'app-flag-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flag-language-selector">
      <div class="flex items-center space-x-3">
        <button 
          *ngFor="let lang of languages"
          (click)="onLanguageSelect(lang.code)"
          class="flag-button relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden shadow hover:shadow-md focus:outline-none hover:scale-110"
          [attr.data-lang]="lang.code"
          [ngClass]="{'opacity-50': selectedLanguage !== lang.code, 'ring-2 ring-blue-500': selectedLanguage === lang.code}">
          <img 
            [src]="getFlagUrl(lang.code)" 
            [alt]="lang.name" 
            class="object-cover w-full h-full">
        </button>
      </div>
    </div>
  `,
  styles: [`
    .flag-language-selector {
      display: inline-block;
    }
    .flag-button {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      cursor: pointer !important;
      transition: transform 0.15s ease-in-out;
    }
    .flag-button:hover {
      transform: scale(1.1);
    }
    img {
      pointer-events: none;
    }
  `]
})
export class FlagLanguageSelectorComponent implements OnInit {
  languages: { code: string, name: string }[] = [];
  selectedLanguage: string = 'en';

  // Direct image URLs for reliability
  private flagUrls: Record<string, string> = {
    'en': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/320px-Flag_of_the_United_Kingdom.svg.png',
    'bg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/320px-Flag_of_Bulgaria.svg.png'
  };

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    console.log('Flag language selector initialized');
    this.languages = this.languageService.availableLanguages;
    console.log('Available languages:', this.languages);
    
    // Get current language
    this.selectedLanguage = this.languageService.getCurrentLanguage();
    console.log('Current language on init:', this.selectedLanguage);
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      console.log('Language changed to:', lang);
      this.selectedLanguage = lang;
    });

    // Add direct click listeners to buttons
    setTimeout(() => {
      const buttons = this.elementRef.nativeElement.querySelectorAll('.flag-button');
      buttons.forEach((button: HTMLElement) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const lang = button.getAttribute('data-lang');
          console.log('Direct button click event for language:', lang);
          if (lang) {
            this.changeLanguage(lang);
          }
        });
      });
    }, 100);
  }

  // Get flag URL
  getFlagUrl(langCode: string): string {
    return this.flagUrls[langCode] || `/assets/images/flags/${langCode}.png`;
  }

  onLanguageSelect(langCode: string): void {
    console.log('Flag clicked via Angular event:', langCode);
    this.changeLanguage(langCode);
  }

  changeLanguage(langCode: string): void {
    console.log('Changing language to:', langCode);
    
    // Force immediate change in UI
    this.selectedLanguage = langCode;
    
    // Update translation service
    this.translateService.use(langCode);
    
    // Update language service
    this.languageService.setLanguage(langCode);
    
    // Force translation reload
    this.translateService.reloadLang(langCode).subscribe(
      () => console.log('Language reloaded successfully'),
      error => console.error('Error reloading language:', error)
    );
    
    // Force page refresh - this is a last resort
    // window.location.reload();
  }
} 