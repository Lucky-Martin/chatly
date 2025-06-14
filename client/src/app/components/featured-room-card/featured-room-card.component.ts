import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITopic } from '../../models/ITopic';
import { SpinnerComponent } from "../spinner/spinner.component";
import { NgClass, NgIf } from '@angular/common';
import { IMessage } from '../../models/IMessage';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-room-card',
  standalone: true,
  imports: [SpinnerComponent, NgIf, NgClass, TruncatePipe, TranslateModule],
  templateUrl: './featured-room-card.component.html',
  styleUrl: './featured-room-card.component.scss'
})
export class FeaturedRoomCardComponent {
  @Input() room: ITopic;
  @Input() isPlaceholder: boolean;
  @Output() clickCard: EventEmitter<ITopic | void> = new EventEmitter<ITopic | void>();

  constructor(private translateService: TranslateService) {}

  protected isRoomValid(): boolean {
    return this.room && Object.keys(this.room).length > 0;
  }

  protected getLastMessage(): IMessage {
    const messages: IMessage[] = this.room.messages;
    const lastMessage: IMessage = messages[messages.length-1];

    return lastMessage || { text: this.translateService.instant('chat.noMessages') };
  }
}
