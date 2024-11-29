import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITopic } from '../../../../../models/ITopic';
import { TruncatePipe } from "../../../../../pipes/truncate.pipe";

@Component({
  selector: 'app-searchbar-filter-item',
  standalone: true,
  imports: [TruncatePipe],
  templateUrl: './searchbar-filter-item.component.html',
  styles: ['button:hover { i { color: #03002E }; }']
})
export class SearchbarFilterItemComponent {
  @Input() conversation: ITopic;
  @Output() clickItem: EventEmitter<ITopic> = new EventEmitter<ITopic>();

  protected onClick(): void {
    this.clickItem.emit(this.conversation);
  }
}
