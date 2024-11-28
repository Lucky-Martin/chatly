import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar-profile-info',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-profile-info.component.html',
  styleUrl: './sidebar-profile-info.component.scss'
})
export class SidebarProfileInfoComponent {
  constructor(private authService: AuthService) { }

  public getUsername(): string {
    return this.authService.username;
  }
}
