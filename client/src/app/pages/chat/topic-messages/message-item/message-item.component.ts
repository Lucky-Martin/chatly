import { Component, Input } from '@angular/core';
import { IMessage } from "../../../../models/IMessage";
import { NgIf, NgSwitch } from "@angular/common";

export enum EMessageViewType {
  Sender,
  Receiver
}

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [
    NgSwitch,
    NgIf
  ],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  @Input() message: IMessage;
  @Input() messageViewType: EMessageViewType;
  protected readonly EMessageViewType = EMessageViewType;
}
