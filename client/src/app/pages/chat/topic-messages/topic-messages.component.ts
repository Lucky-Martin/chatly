import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ChatService, IMessage, ITopic} from "../../../services/chat.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Subscription} from "rxjs";
import {TimeAgoPipe} from "../../../services/time-ago.pipe";
import { EToastTypes, ToastService } from '../../../services/toast.service';
import { PickerComponent } from "@ctrl/ngx-emoji-mart";

@Component({
  selector: 'app-topic-messages',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NgClass,
    TimeAgoPipe,
    PickerComponent
  ],
  templateUrl: './topic-messages.component.html',
  styleUrl: './topic-messages.component.scss'
})
export class TopicMessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private scrollableDiv!: ElementRef<HTMLDivElement>;
  topic: ITopic;
  message: string | undefined;
  messageSubscription: Subscription;
  isEmojiOpen: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastService: ToastService,
              public chatService: ChatService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      const topicId = params['topicId'];
      if (topicId) {
        setTimeout(async () => {
          await this.router.navigate(['chat', 'view'], {queryParams: {topicId}});
        }, 100);

        //simulate delay to show loading animation
        setTimeout(() => {
          this.chatService.fetchTopicMessages(topicId).subscribe(res => {
            this.topic = res;
          }, err => {
            console.log(err);
          });
        }, 1000);

        this.chatService.joinTopic(topicId);

        this.messageSubscription = this.chatService.topicMessages.asObservable().subscribe((messages: IMessage[]) => {
          if (this.topic) {
            this.topic.messages = messages;
          }
        });
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  scrollToBottom(): void {
    if (!this.scrollableDiv) return;

    this.scrollableDiv.nativeElement.scrollTop = this.scrollableDiv.nativeElement.scrollHeight;
  }

  leaveTopic(topicId: string): void {
    this.chatService.leaveTopic(topicId);
    this.topic.messages = [];

    this.router.navigateByUrl('chat');
  }

  onSendMessage() {
    if (!this.message) {
      this.toastService.showToast(EToastTypes.warning, "Enter a valid message!");
      return;
    }

    this.chatService.sendMessage(this.topic.id, this.message);
    this.message = undefined;
  }

  onEmojiSelected(emoji: {emoji: {native: string}}) {
    if (!this.message) {
      this.message = ''
    }

    if (this.message.length === 0) {
      this.message += emoji.emoji.native;
    } else {
      this.message += ' ' + emoji.emoji.native;
    }

    if (window.innerWidth < 992) {
      this.isEmojiOpen = false;
    }
  }
}
