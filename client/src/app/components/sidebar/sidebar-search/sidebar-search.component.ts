import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchbarFilterComponent } from "./searchbar-filter/searchbar-filter.component";
import { NgFor, NgIf } from '@angular/common';
import { SearchbarFilterItemComponent } from "./searchbar-filter/searchbar-filter-item/searchbar-filter-item.component";
import { ITopic } from '../../../models/ITopic';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-search',
  standalone: true,
  imports: [
    SearchbarFilterComponent, 
    SearchbarFilterItemComponent, 
    NgFor, 
    NgIf,
    TranslateModule
  ],
  templateUrl: './sidebar-search.component.html',
  styleUrl: './sidebar-search.component.scss'
})
export class SidebarSearchComponent {
  @Input() conversations: ITopic[];
  @Output() joinConversation: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeQuery: EventEmitter<string> = new EventEmitter<string>();

  protected onJoinConversation(topicId: string): void {
    this.joinConversation.emit(topicId);
  }

  protected onChangeQuery(newQuery: string): void {
    this.changeQuery.emit(newQuery);
  }
}
