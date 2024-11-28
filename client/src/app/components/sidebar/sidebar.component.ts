import { Component } from '@angular/core';
import { SidebarProfileInfoComponent } from "./sidebar-profile-info/sidebar-profile-info.component";
import { NgIf } from '@angular/common';
import { SidebarSearchComponent } from "./sidebar-search/sidebar-search.component";
import { SidebarConversationsComponent } from "./sidebar-conversations/sidebar-conversations.component";

export enum ESidebarMenus {
  ProfileInfo,
  Search,
  Conversations
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarProfileInfoComponent, NgIf, SidebarSearchComponent, SidebarConversationsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  protected ESidebarMenus = ESidebarMenus;
  protected activeMenu: ESidebarMenus = ESidebarMenus.Search;
}
