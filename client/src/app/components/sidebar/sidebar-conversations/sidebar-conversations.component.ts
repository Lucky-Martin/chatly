import { Component, Input } from '@angular/core';
import { ITopic } from '../../../models/ITopic';
import { AuthService } from '../../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { SearchbarFilterItemComponent } from "../sidebar-search/searchbar-filter/searchbar-filter-item/searchbar-filter-item.component";
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-sidebar-conversations',
  standalone: true,
  imports: [NgIf, NgFor, SearchbarFilterItemComponent],
  templateUrl: './sidebar-conversations.component.html',
  styleUrl: './sidebar-conversations.component.scss'
})
export class SidebarConversationsComponent {
  @Input() conversations: ITopic[];

  constructor(private authService: AuthService,
              private chatService: ChatService) { }

  protected onOpenConversations(conversationId: string): void {
    this.chatService.joinTopic(conversationId);
  }

  protected getPrivateConversations(): ITopic[] {
    if (!this.authService.user || !this.authService.user._id) {
      return [];
    }

    return this.conversations.filter(conversation => {
      return conversation.createdBy === this.authService.user._id;
    });
  }
}
