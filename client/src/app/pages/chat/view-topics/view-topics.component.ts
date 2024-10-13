import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import {TopicItemComponent} from "./topic-item/topic-item.component";
import {CreateTopicModalComponent} from "./create-topic-modal/create-topic-modal.component";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import {ChatService} from "../../../services/chat.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-view-topics',
  standalone: true,
  imports: [
    TopicItemComponent,
    CreateTopicModalComponent,
    NgIf,
    NgForOf,
    NgClass,
    FormsModule
  ],
  templateUrl: './view-topics.component.html',
  styleUrl: './view-topics.component.scss'
})
export class ViewTopicsComponent implements OnInit {
  @Input() eventEmitter: EventEmitter<void> = new EventEmitter();
  @ViewChild('searchInput') searchInput!: ElementRef;
  topicModalOpen: boolean;
  searchActive: boolean = false;
  searchQuery: string = '';
  // pollingUpdate = {
  //   status: true,
  //   timeout: 2000
  // }

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

  getTopics() {
    if (this.searchQuery.length > 0) {
      return this.chatService.topics.filter(topic => {
        return topic.name.includes(this.searchQuery);
      });
    } else {
      return this.chatService.topics;
    }
  }

  toggleTopicModal(state: boolean) {
    console.log('here')
    this.topicModalOpen = state;
  }

  toggleSearch(): void {
    this.searchActive = !this.searchActive;

    // Focus the input field when it's shown
    if (this.searchActive) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0); // timeout ensures this runs after the view is updated
    }
  }

  private fetchTopics() {
    this.chatService.getTopics().subscribe(res => {
      this.chatService.topics = res;
    }, err => {
      console.log(err);
    })
  }
}
