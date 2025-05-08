import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule, NgIf } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';
import { FlagLanguageSelectorComponent } from '../../../components/flag-language-selector/flag-language-selector.component';

@Component({
  selector: 'app-initial-screen',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgIf,
    TranslateModule,
    FlagLanguageSelectorComponent
  ],
  templateUrl: './initial-screen.component.html',
  styleUrl: './initial-screen.component.scss'
})
export class InitialScreenComponent {
  navState: boolean = false;

  constructor(private router: Router) {
    console.log('Initial screen component initialized');
  }

  goToHome(event: Event): void {
    console.log('Navigate to home');
    event.preventDefault();
    this.router.navigate(['/']);
  }

  goToChat(event: Event): void {
    console.log('Navigate to chat');
    event.preventDefault();
    this.router.navigate(['/chat']);
  }

  goToSignup(event: Event): void {
    console.log('Navigate to signup');
    event.preventDefault();
    this.router.navigate(['auth', 'signup']);
  }

  goToLogin(event: Event): void {
    console.log('Navigate to login');
    event.preventDefault();
    this.router.navigate(['auth', 'login']);
  }

  goToContact(event: Event): void {
    console.log('Navigate to contact');
    event.preventDefault();
    // Just close mobile menu if open as there's no contact page yet
    if (this.navState) {
      this.onToggleNavState();
    }
    
    // Show an alert for now since there's no contact page
    alert('Contact page not yet implemented');
  }

  async onNavigate(route: string) {
    console.log('Navigate to', route);
    await this.router.navigate(['auth', route]);
  }

  onToggleNavState() {
    this.navState = !this.navState;
    console.log('Nav state toggled to:', this.navState);
  }
}
