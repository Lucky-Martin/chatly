import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private readonly LANGUAGE_KEY = 'chatly_preferred_language';
  public availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'bg', name: 'Български' }
  ];

  constructor(private translate: TranslateService) {
    console.log('Language service initialized');
    
    // Set available languages
    this.translate.addLangs(['en', 'bg']);
    
    // Set fallback language
    this.translate.setDefaultLang('en');
    
    // Initialize with saved language or default
    const savedLang = this.getSavedLanguage();
    console.log('Saved language detected:', savedLang);
    this.initializeLanguage(savedLang);

    // Add event logging
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('app-flag-language-selector button')) {
        console.log('Flag button clicked!', event);
      }
    });
  }

  private getSavedLanguage(): string {
    try {
      const savedLang = localStorage.getItem(this.LANGUAGE_KEY);
      console.log('Read from localStorage:', savedLang);
      if (savedLang && this.isValidLanguage(savedLang)) {
        return savedLang;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    return 'en'; // Default to English
  }

  private isValidLanguage(langCode: string): boolean {
    return this.availableLanguages.some(lang => lang.code === langCode);
  }

  private initializeLanguage(langCode: string): void {
    if (this.isValidLanguage(langCode)) {
      console.log('Initializing with language:', langCode);
      this.translate.use(langCode);
      this.currentLanguageSubject.next(langCode);
    } else {
      console.warn(`Invalid language code for initialization: ${langCode}, using default 'en'`);
      this.translate.use('en');
      this.currentLanguageSubject.next('en');
    }
  }

  setLanguage(langCode: string): void {
    console.log('Setting language to:', langCode);
    if (this.isValidLanguage(langCode)) {
      try {
        // Force language change
        this.translate.use(langCode);
        localStorage.setItem(this.LANGUAGE_KEY, langCode);
        this.currentLanguageSubject.next(langCode);
        console.log('Language set successfully to:', langCode);

        // Force refresh translations throughout the app
        this.translate.reloadLang(langCode).subscribe(() => {
          console.log('Language reloaded successfully');
          
          // Notify the app with a custom event
          const event = new CustomEvent('language-changed', { detail: langCode });
          document.dispatchEvent(event);
        });
      } catch (error) {
        console.error('Error setting language:', error);
      }
    } else {
      console.warn(`Invalid language code: ${langCode}`);
    }
  }

  getCurrentLanguage(): string {
    const current = this.currentLanguageSubject.value;
    console.log('Current language requested:', current);
    return current;
  }

  getLanguageName(langCode: string): string {
    const lang = this.availableLanguages.find(l => l.code === langCode);
    return lang ? lang.name : '';
  }
} 