import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { IMessage } from '../../../models/IMessage';
import { Filter } from 'bad-words';
import { EToastTypes, ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-edit-message-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-message-modal.component.html',
  styleUrl: './edit-message-modal.component.scss'
})
export class EditMessageModalComponent implements OnInit {
  @Input() message: IMessage;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  protected newMessage: string;
  private profanityFilter: Filter = new Filter();

  constructor(private chatService: ChatService,
              private toastService: ToastService) { }

  public ngOnInit(): void {
    this.newMessage = `${this.message.text}`;
  }

  protected onEditMessage(): void {
    if (this.profanityFilter.isProfane(this.newMessage)) {
      this.toastService.showToast(EToastTypes.warning, "Profanity words are not allowed!" );
      return;
    }

    this.chatService.editMessage(this.chatService.currentTopicId, this.message.messageId, this.newMessage).subscribe(() => {
      this.closeModal.emit();
    }, err => {
      console.warn(err);
    });
  }

  protected onCloseModal(): void {
    this.closeModal.emit();
  }

}
