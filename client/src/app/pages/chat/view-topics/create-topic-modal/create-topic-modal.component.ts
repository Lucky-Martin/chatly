import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatService} from "../../../../services/chat.service";

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

  constructor(private chatService: ChatService) {
  }

  onCloseModal() {
    this.modalClosed.emit();
  }

  onCreateTopic() {
    this.chatService.createTopic(this.topicName);
    this.modalClosed.emit();
  }
}
