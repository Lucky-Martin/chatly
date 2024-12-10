import { Component, Input } from '@angular/core';
import { ITopic } from '../../../models/ITopic';
import { AuthService } from '../../../services/auth/auth.service';
import { NgFor } from '@angular/common';
import { SearchbarFilterItemComponent } from "../sidebar-search/searchbar-filter/searchbar-filter-item/searchbar-filter-item.component";
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-sidebar-conversations',
  standalone: true,
  imports: [NgFor, SearchbarFilterItemComponent],
  templateUrl: './sidebar-conversations.component.html',
  styleUrl: './sidebar-conversations.component.scss'
})
export class SidebarConversationsComponent {
  @Input() conversations: ITopic[];
  protected isConversationsSorted: boolean = true;

  constructor(private authService: AuthService,
              private chatService: ChatService) { }

  protected onOpenConversations(conversationId: string): void {
    this.chatService.joinTopic(conversationId);
  }

  protected getPublicConversations(): ITopic[] {
    if (this.isConversationsSorted) {
      const sortedConversations: ITopic[] = [...this.conversations];
      return sortedConversations.sort((a, b) => b.participants.length - a.participants.length);
    } else {
      return [...this.conversations];
    }
  }

  protected getPrivateConversations(): ITopic[] {
    if (!this.authService.user || !this.authService.user._id) {
      return [];
    }

    return this.conversations.filter(conversation => {
      return conversation.createdBy === this.authService.user._id;
    });
  }

  protected onToggleFilter(): void {
    this.isConversationsSorted = !this.isConversationsSorted;
  }
}
