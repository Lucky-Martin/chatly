import { Component, EventEmitter, Input, OnInit } from '@angular/core';
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
  @Input() eventEmitter: EventEmitter<void> = new EventEmitter();
  topicModalOpen: boolean;
  pollingUpdate = {
    status: true,
    timeout: 2000
  }

  constructor(public chatService: ChatService) {
  }

  ngOnInit() {
    // if (this.pollingUpdate.status) {
    //   this.fetchTopics();
    //   setInterval(this.fetchTopics.bind(this), this.pollingUpdate.timeout);
    // } else {
    // }
    this.fetchTopics();

    this.eventEmitter.subscribe(() => {
      this.toggleTopicModal(!this.topicModalOpen);
    })
  }

  toggleTopicModal(state: boolean) {
    console.log('here')
    this.topicModalOpen = state;
  }

  private fetchTopics() {
    this.chatService.getTopics().subscribe(res => {
      this.chatService.topics = res;
    }, err => {
      console.log(err);
    })
  }
}
