import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../models/IUser';
import { NgIf } from '@angular/common';
import { SpinnerComponent } from "../../spinner/spinner.component";

@Component({
  selector: 'app-sidebar-profile-info',
  standalone: true,
  imports: [NgIf, SpinnerComponent],
  templateUrl: './sidebar-profile-info.component.html',
  styleUrl: './sidebar-profile-info.component.scss'
})
export class SidebarProfileInfoComponent {
  constructor(private authService: AuthService) { }

  public getUser(): IUser {
    return this.authService.user;
  }
}
