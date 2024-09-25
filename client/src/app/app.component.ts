import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AuthService} from "./services/auth.service";
import { ToastTemplatesComponent } from './components/toast-templates/toast-templates.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastTemplatesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'casualino-task';

  constructor(private authService: AuthService) {
  }

  async ngOnInit() {
    await this.authService.checkInitialLoginStatus();
  }
}
