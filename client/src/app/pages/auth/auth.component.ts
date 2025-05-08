import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  imports: [
    RouterOutlet,
    TranslateModule
  ],
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // Ensure language is properly set for all auth pages
    const currentLang = this.languageService.getCurrentLanguage();
    console.log('Auth component: setting language to', currentLang);
    this.translateService.use(currentLang);
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      console.log('Auth component: language changed to', lang);
      this.translateService.use(lang);
    });
  }
}
