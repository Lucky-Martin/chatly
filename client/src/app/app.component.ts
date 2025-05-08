import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { ToastTemplatesComponent } from './components/toast-templates/toast-templates.component';
import { ChatService } from './services/chat.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastTemplatesComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private languageSubscription: Subscription | null = null;
  private languageChangeListener: any;
  
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {
    console.log('App component initialized');
    
    // Listen for language changes
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(lang => {
      console.log('App component detected language change to:', lang);
      // Ensure the translate service uses this language
      this.translateService.use(lang);
    });
    
    // Also listen for custom language-changed event
    this.languageChangeListener = (event: CustomEvent) => {
      console.log('Custom language change event detected:', event.detail);
      this.translateService.use(event.detail);
    };
    
    document.addEventListener('language-changed', this.languageChangeListener);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeClose(event: Event): void {
    this.chatService.disconnect();
  }

  @HostListener('window:focusout', ['$event'])
  onFocusOut(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target && target.tagName === 'INPUT') {
      // Keyboard is likely closed, scroll to top
      this.scrollToTop();
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("scroll");
  }

  async ngOnInit() {
    // Initialize language service for the entire app
    console.log('App component ngOnInit');
    
    // Initialize authentication and other services
    await this.authService.checkInitialLoginStatus();
  }
  
  ngOnDestroy() {
    // Clean up subscriptions
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    
    // Remove event listener
    if (this.languageChangeListener) {
      document.removeEventListener('language-changed', this.languageChangeListener);
    }
  }
}
