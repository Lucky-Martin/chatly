import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatService} from "../../../../services/chat.service";
import { EToastTypes, ToastService } from '../../../../services/toast.service';

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
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  topicName: string;

  constructor(private chatService: ChatService,
              private toastService: ToastService
  ) {
  }

  onCloseModal() {
    this.modalClosed.emit();
  }

  onCreateTopic() {
    console.log(this.topicName);
    
    if (!this.topicName) {
      this.toastService.showToast(EToastTypes.warning, 'Enter topic name!')
      return;
    };

    this.chatService.createTopic(this.topicName);
    this.modalClosed.emit();
  }
}
