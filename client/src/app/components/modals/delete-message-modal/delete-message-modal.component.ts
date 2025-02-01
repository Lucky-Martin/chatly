import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMessage } from '../../../models/IMessage';
import { ChatService } from "../../../services/chat.service";

@Component({
  selector: 'app-delete-message-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-message-modal.component.html',
  styleUrl: './delete-message-modal.component.scss'
})
export class DeleteMessageModalComponent {
  @Input() message: IMessage;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(private chatService: ChatService) { }

  protected onDeleteMessage(event: Event): void {
    event.preventDefault();

    this.chatService.deleteMessage(this.chatService.currentTopicId, this.message.messageId).subscribe(() => {
      this.closeModal.emit();
    }, err => {
      console.warn(err);
    });
  }
}
