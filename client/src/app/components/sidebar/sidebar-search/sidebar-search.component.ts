import { Component, OnInit } from '@angular/core';
import { SearchbarFilterComponent } from "./searchbar-filter/searchbar-filter.component";
import { ChatService } from '../../../services/chat.service';
import { ITopic } from '../../../models/ITopic';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sidebar-search',
  standalone: true,
  imports: [SearchbarFilterComponent, NgFor],
  templateUrl: './sidebar-search.component.html',
  styleUrl: './sidebar-search.component.scss'
})
export class SidebarSearchComponent implements OnInit {
  private conversations: ITopic[] = [];
  protected filteredConversations: ITopic[] = [];

  constructor(private chatService: ChatService) { }

  public ngOnInit(): void {
    this.chatService.fetchTopics().subscribe(conversations => {
      this.conversations = conversations;
      this.filteredConversations = conversations;
    });

    this.chatService.topics.subscribe((topics: ITopic[]) => {
      this.conversations = topics;
    });
  }

  protected onChangeQuery(query: string): void {
    this.filteredConversations = this.conversations.filter((conversation: ITopic) => {
      return conversation.name.toLowerCase().includes(query.toLowerCase());
    });
  }
}
