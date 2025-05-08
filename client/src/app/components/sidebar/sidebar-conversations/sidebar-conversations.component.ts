import { Component, Input } from '@angular/core';
import { ITopic } from '../../../models/ITopic';
import { AuthService } from '../../../services/auth/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { SearchbarFilterItemComponent } from "../sidebar-search/searchbar-filter/searchbar-filter-item/searchbar-filter-item.component";
import { ChatService } from '../../../services/chat.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-conversations',
  standalone: true,
  imports: [NgFor, NgIf, SearchbarFilterItemComponent, TranslateModule],
  templateUrl: './sidebar-conversations.component.html',
  styleUrl: './sidebar-conversations.component.scss'
})
export class SidebarConversationsComponent {
  @Input() conversations: ITopic[];
  protected conversationSortType: string = "popular";

  constructor(private authService: AuthService,
              private chatService: ChatService) { }

  protected onOpenConversations(conversationId: string): void {
    this.chatService.joinTopic(conversationId);
  }

  protected getPublicConversations(): ITopic[] {
    let publicConversations: ITopic[] = [...this.conversations];

    // Sort by popularity if enabled
    switch (this.conversationSortType) {
      case "popular":
        publicConversations.sort((a, b) => b.participants.length - a.participants.length);
        break;
      case "interests":
        publicConversations.sort((a, b) => {
          const aMatchCount = a.interests.filter(interest =>
            this.authService.user.interests.includes(interest)
          ).length;
          const bMatchCount = b.interests.filter(interest =>
            this.authService.user.interests.includes(interest)
          ).length;
          return bMatchCount - aMatchCount;
        });
        break;
    }

    return publicConversations;
  }

  protected getPrivateConversations(): ITopic[] {
    if (!this.authService.user || !this.authService.user._id) {
      return [];
    }

    return this.conversations.filter(conversation => {
      return conversation.createdBy === this.authService.user._id;
    });
  }

  protected onUpdateSortType(event: any): void {
    const sortType: string = event.target.value;
    this.conversationSortType = sortType;
  }
}
