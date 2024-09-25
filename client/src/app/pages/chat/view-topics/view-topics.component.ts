import {Component, OnInit} from '@angular/core';
import {TopicItemComponent} from "./topic-item/topic-item.component";
import {CreateTopicModalComponent} from "./create-topic-modal/create-topic-modal.component";
import {NgForOf, NgIf} from "@angular/common";
import {ChatService} from "../../../services/chat.service";

@Component({
  selector: 'app-view-topics',
  standalone: true,
  imports: [
    TopicItemComponent,
    CreateTopicModalComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './view-topics.component.html',
  styleUrl: './view-topics.component.scss'
})
export class ViewTopicsComponent implements OnInit {
  topicModalOpen: boolean;

  constructor(public chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.getTopics().subscribe(res => {
      this.chatService.topics = res;
    }, err => {
      console.log(err);
    })
  }

  toggleTopicModal(state: boolean) {
    this.topicModalOpen = state;
  }
}
