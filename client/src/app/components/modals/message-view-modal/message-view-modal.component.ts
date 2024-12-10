import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMessage } from '../../../models/IMessage';

@Component({
  selector: 'app-message-view-modal',
  standalone: true,
  imports: [],
  templateUrl: './message-view-modal.component.html',
  styleUrl: './message-view-modal.component.scss'
})
export class MessageViewModalComponent {
  @Input() message: IMessage;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
}
