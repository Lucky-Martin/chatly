import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { IMessage } from '../../../models/IMessage';
import { Filter } from 'bad-words';
import { EToastTypes, ToastService } from '../../../services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-message-modal',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './edit-message-modal.component.html',
  styleUrl: './edit-message-modal.component.scss'
})
export class EditMessageModalComponent implements OnInit {
  @Input() message: IMessage;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  protected newMessage: string = '';
  private profanityFilter: Filter = new Filter();

  constructor(private chatService: ChatService,
              private toastService: ToastService,
              private translateService: TranslateService) { }

  public ngOnInit(): void {
    this.newMessage = `${this.message.text}`;
  }

  protected isMessageValid(): boolean {
    return typeof this.newMessage === 'string' && this.newMessage.trim().length > 0;
  }

  protected onEditMessage(): void {
    if (!this.isMessageValid()) {
      this.toastService.showToast(EToastTypes.warning, this.translateService.instant('errors.messageCannotBeEmpty'));
      return;
    }

    if (this.profanityFilter.isProfane(this.newMessage)) {
      this.toastService.showToast(EToastTypes.warning, this.translateService.instant('errors.profanityNotAllowed'));
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
