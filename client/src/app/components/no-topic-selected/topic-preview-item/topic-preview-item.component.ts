import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ITopic } from '../../../models/ITopic';
import { TruncatePipe } from "../../../pipes/truncate.pipe";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-topic-preview-item',
  standalone: true,
  imports: [
    TruncatePipe,
    NgIf
  ],
  templateUrl: './topic-preview-item.component.html',
  styleUrl: './topic-preview-item.component.scss'
})
export class TopicPreviewItemComponent implements OnInit, OnChanges {
  @Input() topic: ITopic;
  @Output() topicJoined: EventEmitter<ITopic> = new EventEmitter<ITopic>();
  @Output() createTopic: EventEmitter<void> = new EventEmitter<void>();
  presentDescriptionMessage: string;

  ngOnInit() {
    this.updatePreviewMessage();
  }

  private updatePreviewMessage() {
    if (!this.topic || this.topic.id === 'empty') return;

    const messages = this.topic.messages;
    if (messages[messages.length - 1]) {
      this.presentDescriptionMessage = messages[messages.length - 1].text;
    } else {
      this.presentDescriptionMessage = 'No messages yet! Be the first to write something...';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updatePreviewMessage();
  }

  onJoinTopic() {
    this.topicJoined.emit(this.topic);
  }

  onCreateTopic() {
    this.createTopic.emit();
  }
}
