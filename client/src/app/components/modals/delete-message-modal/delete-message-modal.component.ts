import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMessage } from '../../../models/IMessage';

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

  protected onDeleteMessage(): void {
    this.closeModal.emit();
  }
}
