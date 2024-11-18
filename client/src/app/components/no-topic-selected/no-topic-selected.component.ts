import { Component, EventEmitter, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { TopicPreviewItemComponent } from "./topic-preview-item/topic-preview-item.component";
import { NgForOf, NgIf } from "@angular/common";
import { ViewTopicsComponent } from "../../pages/chat/view-topics/view-topics.component";
import { CreateTopicModalComponent } from "../create-topic-modal/create-topic-modal.component";
import { ITopic } from "../../models/ITopic";

@Component({
  selector: 'app-no-topic-selected',
  standalone: true,
  imports: [TopicPreviewItemComponent, NgForOf, NgIf, ViewTopicsComponent, CreateTopicModalComponent],
  templateUrl: './no-topic-selected.component.html',
  styleUrl: './no-topic-selected.component.scss'
})
export class NoTopicSelectedComponent implements OnInit {
  private readonly templateSlots: number = 7;
  createTopicModalOpen: boolean = false;
  topicsTemplate: any;

  constructor(public chatService: ChatService) {}

  ngOnInit(): void {
    this.topicsTemplate = {};

    this.chatService.getTopics().subscribe(data => {
      this.chatService.topics = data.sort((a, b) => b.participants.length - a.participants.length);
      this.fillTemplate();
    });
  }

  private fillTemplate() {
    let topics = this.chatService.topics;

    // Reset template object
    this.topicsTemplate = {};

    if (topics.length >= this.templateSlots) {
      // Take only up to templateSlots amount
      for (let i = 0; i < this.templateSlots; i++) {
        Object.defineProperty(this.topicsTemplate, i, { value: topics[i] });
      }
    } else {
      // Fill available topics
      for (let i = 0; i < topics.length; i++) {
        Object.defineProperty(this.topicsTemplate, i, { value: topics[i] });
      }

      // Fill remaining slots with empty topics
      for (let i = topics.length; i < this.templateSlots; i++) {
        Object.defineProperty(this.topicsTemplate, i, { value: { id: "empty" } });
      }
    }
  }

  onUpdateNewTopicModalState(state: boolean) {
    this.createTopicModalOpen = state;
  }

  onJoinTopic(topic: ITopic) {
    this.chatService.joinTopic(topic.id);
  }
}
