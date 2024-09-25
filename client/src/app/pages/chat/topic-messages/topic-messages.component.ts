import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatService, IMessage, ITopic} from "../../../services/chat.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Subscription} from "rxjs";
import {TimeAgoPipe} from "../../../services/time-ago.pipe";

@Component({
  selector: 'app-topic-messages',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NgClass,
    TimeAgoPipe
  ],
  templateUrl: './topic-messages.component.html',
  styleUrl: './topic-messages.component.scss'
})
export class TopicMessagesComponent implements OnInit, OnDestroy {
  topic: ITopic;
  message: string | undefined;
  messageSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private chatService: ChatService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const topicId = params['topicId'];
      if (topicId) {
        //simulate delay to show loading animation
        setTimeout(() => {
          this.chatService.fetchTopicMessages(topicId).subscribe(res => {
            this.topic = res;
          }, err => {
            console.log(err);
          });
        }, 1000);

        console.log(this.authService.username)

        this.chatService.joinTopic(topicId);

        this.messageSubscription = this.chatService.topicMessages.asObservable().subscribe((messages: IMessage[]) => {
          if (this.topic) {
            this.topic.messages = messages;
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  leaveTopic(topicId: string): void {
    this.chatService.leaveTopic(topicId);
    this.topic.messages = [];

    this.router.navigateByUrl('chat');
  }

  onSendMessage() {
   this.chatService.sendMessage(this.topic.id, this.message!);
   this.message = undefined;
  }
}
