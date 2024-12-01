import { Component, Input } from '@angular/core';
import { NgIf, NgSwitch } from "@angular/common";
import { IMessage } from '../../../models/IMessage';
import { TimeAgoPipe } from "../../../services/time-ago.pipe";
import { TruncatePipe } from "../../../pipes/truncate.pipe";

export enum EMessageViewType {
  Sender,
  Receiver
}

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [
    NgIf,
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

  protected onOpenProfilePreview(): void {

  }
}
