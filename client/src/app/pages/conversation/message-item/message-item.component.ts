import { Component, Input } from '@angular/core';
import { IMessage } from '../../../models/IMessage';
import { TimeAgoPipe } from "../../../pipes/time-ago.pipe";
import { TruncatePipe } from "../../../pipes/truncate.pipe";
import { openMessagePreviewModal } from '../../../services/subjects';

export enum EMessageViewType {
  Sender,
  Receiver
}

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [
    TimeAgoPipe,
    TruncatePipe
],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  @Input() message: IMessage;
  @Input() messageViewType: EMessageViewType;
  protected readonly EMessageViewType = EMessageViewType;

  protected onToggleProfilePreview(): void {
    openMessagePreviewModal.next(this.message);
  }
}
