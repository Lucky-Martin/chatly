import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Filter } from 'bad-words';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth/auth.service';
import { EToastTypes, ToastService } from '../../../services/toast.service';
import { SearchbarDropdownComponent } from "./searchbar-dropdown/searchbar-dropdown.component";

@Component({
  selector: 'app-create-topic-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SearchbarDropdownComponent
  ],
  templateUrl: './create-topic-modal.component.html',
  styleUrl: './create-topic-modal.component.scss'
})
export class CreateTopicModalComponent {
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  topicName: string;
  publicChatRoom: boolean = true;
  interests: string[];
  private profanityFilter: Filter = new Filter();

  constructor(private chatService: ChatService,
              private authService: AuthService,
              private toastService: ToastService
  ) {
  }

  onCloseModal() {
    this.modalClosed.emit();
  }

  onCreateTopic() {
    if (!this.topicName) {
      this.toastService.showToast(EToastTypes.warning, 'Enter room name!')
      return;
    }

    if (this.profanityFilter.isProfane(this.topicName)) {
      this.toastService.showToast(EToastTypes.warning, "Profanity words are not allowed!");
      return;
    }

    if (this.chatService.currentTopicId) {
      this.chatService.leaveTopic(this.chatService.currentTopicId);
    }

    this.chatService.createTopic(this.topicName, this.interests, this.publicChatRoom, this.authService.user._id);
    this.modalClosed.emit();
  }

  onChangeState() {
    this.publicChatRoom = !this.publicChatRoom;
  }
}
