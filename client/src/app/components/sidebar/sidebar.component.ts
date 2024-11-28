import { Component } from '@angular/core';
import { SidebarProfileInfoComponent } from "./sidebar-profile-info/sidebar-profile-info.component";
import { NgIf } from '@angular/common';

export enum ESidebarMenus {
  ProfileInfo,
  Search,
  Conversations
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarProfileInfoComponent, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  protected ESidebarMenus = ESidebarMenus;
  protected activeMenu: ESidebarMenus = ESidebarMenus.ProfileInfo;
}
