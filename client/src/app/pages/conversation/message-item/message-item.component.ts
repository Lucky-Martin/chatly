import { Component, Input } from '@angular/core';
import { IMessage } from '../../../models/IMessage';
import { TimeAgoPipe } from "../../../pipes/time-ago.pipe";
import { TruncatePipe } from "../../../pipes/truncate.pipe";
import { openDeleteMessageModal, openMessageEditModal, openMessagePreviewModal } from '../../../subjects/subjects';
import { NgClass, SlicePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export enum EMessageViewType {
  Sender,
  Receiver
}

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [
    TimeAgoPipe,
    TruncatePipe,
    NgClass,
    TranslateModule,
    SlicePipe
],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  @Input() message: IMessage;
  @Input() messageViewType: EMessageViewType;
  protected readonly EMessageViewType = EMessageViewType;
  protected isOptionsOpen: boolean = false;

  protected onToggleProfilePreview(): void {
    openMessagePreviewModal.next(this.message);
  }

  protected onToggleOptions(): void {
    this.isOptionsOpen = !this.isOptionsOpen;
  }

  protected onEditMessage(): void {
    openMessageEditModal.next(this.message);
  }

  protected onDeleteMessage(): void {
    openDeleteMessageModal.next(this.message);
  }
}
