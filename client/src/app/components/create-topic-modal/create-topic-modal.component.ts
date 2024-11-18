import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatService} from "../../services/chat.service";
import { EToastTypes, ToastService } from '../../services/toast.service';
import { AuthService } from "../../services/auth.service";
import { Filter } from 'bad-words';

@Component({
  selector: 'app-create-topic-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './create-topic-modal.component.html',
  styleUrl: './create-topic-modal.component.scss'
})
export class CreateTopicModalComponent {
  private profanityFilter: Filter = new Filter();
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  topicName: string;
  publicChatRoom: boolean = true;

  constructor(private chatService: ChatService,
              private authService: AuthService,
              private toastService: ToastService
  ) { }

  onCloseModal() {
    this.modalClosed.emit();
  }

  onCreateTopic() {
    if (!this.topicName) {
      this.toastService.showToast(EToastTypes.warning, 'Enter topic name!')
      return;
    }

    if (this.profanityFilter.isProfane(this.topicName)) {
      this.toastService.showToast(EToastTypes.warning, "Profanity words are not allowed!");
      return;
    }

    if (this.chatService.inTopic) {
      this.chatService.leaveTopic(this.chatService.topicId);
    }

    this.chatService.createTopic(this.topicName, this.publicChatRoom, this.authService.user._id);
    this.modalClosed.emit();
  }

  onChangeState() {
    this.publicChatRoom = !this.publicChatRoom;
  }
}
