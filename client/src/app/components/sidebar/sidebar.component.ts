import { Component, OnInit } from '@angular/core';
import { SidebarProfileInfoComponent } from "./sidebar-profile-info/sidebar-profile-info.component";
import { NgClass, NgIf } from '@angular/common';
import { SidebarSearchComponent } from "./sidebar-search/sidebar-search.component";
import { SidebarConversationsComponent } from "./sidebar-conversations/sidebar-conversations.component";
import { ITopic } from '../../models/ITopic';
import { ChatService } from '../../services/chat.service';
import { openCreateModalSubject } from '../../services/subjects';
import { Subject } from 'rxjs';

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
  protected activeMenu: ESidebarMenus = ESidebarMenus.Search;
  protected openCreateModalSubject: Subject<void> = openCreateModalSubject;
  protected filteredConversations: ITopic[] = [];
  private conversations: ITopic[] = [];
  private query: string;

  constructor(private chatService: ChatService) { }

  public ngOnInit(): void {
    this.query = "";

    this.chatService.fetchTopics().subscribe(conversations => {
      this.conversations = conversations;
      this.filteredConversations = conversations;
    });

    this.chatService.topics.subscribe((topics: ITopic[]) => {
      this.conversations = topics;
      this.filterConversations();
    });
  }

  protected onChangeQuery(query: string): void {
    this.query = query;
    this.filterConversations();
  }

  protected onJoinConversation(conversationId: string) {
    if (this.chatService.topicId) {
      this.chatService.leaveTopic(this.chatService.topicId);
    }

    this.chatService.joinTopic(conversationId);
  }

  private filterConversations(): void {
    this.filteredConversations = this.conversations.filter((conversation: ITopic) => {
      return conversation.name.toLowerCase().includes(this.query.toLowerCase());
    });
  }
}
