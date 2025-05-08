import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../models/IUser';
import { NgIf } from '@angular/common';
import { SpinnerComponent } from "../../spinner/spinner.component";
import { FlagLanguageSelectorComponent } from '../../flag-language-selector/flag-language-selector.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-profile-info',
  standalone: true,
  imports: [NgIf, SpinnerComponent, FlagLanguageSelectorComponent, TranslateModule],
  templateUrl: './sidebar-profile-info.component.html',
  styleUrl: './sidebar-profile-info.component.scss'
})
export class SidebarProfileInfoComponent {
  constructor(private authService: AuthService) { }

  public getUser(): IUser {
    return this.authService.user;
  }
}
