import { Component, OnInit } from '@angular/core';
import { SidebarProfileInfoComponent } from "./sidebar-profile-info/sidebar-profile-info.component";
import { NgClass, NgIf } from '@angular/common';
import { SidebarSearchComponent } from "./sidebar-search/sidebar-search.component";
import { SidebarConversationsComponent } from "./sidebar-conversations/sidebar-conversations.component";
import { ITopic } from '../../models/ITopic';
import { ChatService } from '../../services/chat.service';
import { openCreateModalSubject, openLogoutModalSubject } from '../../services/subjects';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

export enum ESidebarMenus {
  ProfileInfo,
  Search,
  Conversations
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarProfileInfoComponent, NgIf, NgClass, SidebarSearchComponent, SidebarConversationsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  protected ESidebarMenus = ESidebarMenus;
  protected isSidebarExpanded: boolean = false;
  protected activeMenu: ESidebarMenus = ESidebarMenus.Conversations;
  protected openCreateModalSubject: Subject<void> = openCreateModalSubject;
  protected filteredConversations: ITopic[] = [];
  protected conversations: ITopic[] = [];
  private query: string;

  constructor(private chatService: ChatService,
              private router: Router) { }

  public ngOnInit(): void {
    this.query = "";

    this.chatService.getTopics().subscribe(conversations => {
      this.conversations = conversations;
      this.filteredConversations = conversations;
    });

    this.chatService.topics$.subscribe((topics: ITopic[]) => {
      this.conversations = topics;
      this.filterConversations();
    });
  }

  protected onChangeMenu(newMenu: ESidebarMenus): void {
    this.activeMenu = newMenu;
    this.isSidebarExpanded = true;
  }

  protected onNavigateHome(): void {
    if (this.chatService.currentTopicId) {
      this.chatService.leaveTopic(this.chatService.currentTopicId);
    }

    this.router.navigate(['chat']);
  }

  protected onLogout(): void {
    openLogoutModalSubject.next();
  }

  protected onChangeQuery(query: string): void {
    this.query = query;
    this.filterConversations();
  }

  protected onJoinConversation(conversationId: string) {
    if (this.chatService.currentTopicId) {
      this.chatService.leaveTopic(this.chatService.currentTopicId);
    }

    this.chatService.joinTopic(conversationId);
  }

  private filterConversations(): void {
    this.filteredConversations = this.conversations.filter((conversation: ITopic) => {
      return conversation.name.toLowerCase().includes(this.query.toLowerCase());
    });
  }
}
