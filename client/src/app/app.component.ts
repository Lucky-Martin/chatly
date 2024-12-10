import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { ToastTemplatesComponent } from './components/toast-templates/toast-templates.component';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastTemplatesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeClose(event: Event): void {
    this.chatService.disconnect();
  }

  async ngOnInit() {
    await this.authService.checkInitialLoginStatus();
  }
}
