import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { TimeAgoPipe } from '../../../services/time-ago.pipe';
import { EToastTypes, ToastService } from '../../../services/toast.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { ITopic } from '../../../models/ITopic';
import { IMessage } from '../../../models/IMessage';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { Filter } from 'bad-words';
import { TruncatePipe } from "../../../pipes/truncate.pipe";
import { EMessageViewType, MessageItemComponent } from "./message-item/message-item.component";

@Component({
  selector: 'app-topic-messages',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NgClass,
    TimeAgoPipe,
    PickerComponent,
    EmojiPickerComponent,
    ParticipantsListComponent,
    SpinnerComponent,
    TruncatePipe,
    MessageItemComponent,
  ],
  templateUrl: './topic-messages.component.html',
  styleUrl: './topic-messages.component.scss',
})
export class TopicMessagesComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('messageContainer')
  private scrollableDiv!: ElementRef<HTMLDivElement>;
  private profanityFilter: Filter;
  topic: ITopic | undefined;
  message: string | undefined;
  messageSubscription: Subscription;
  isEmojiOpen: boolean;
  isParticipantVisible: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    public chatService: ChatService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.profanityFilter = new Filter();

    this.route.queryParams.subscribe((params) => {
      const topicId = params['topicId'];
      if (topicId) {
        setTimeout(async () => {
          await this.router.navigate(['chat', 'view'], {
            queryParams: { topicId },
          });
        }, 100);

        //simulate delay to show loading animation
        this.topic = undefined;

        setTimeout(() => {
          this.chatService.fetchTopicMessages(topicId).subscribe(
            (res) => {
              this.topic = res;
            },
            (err) => {
              console.log(err);
            }
          );
        }, 1000);

        this.chatService.joinTopic(topicId);

        this.messageSubscription = this.chatService.topicMessages
          .asObservable()
          .subscribe((messages: IMessage[]) => {
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

    this.scrollableDiv.nativeElement.scrollTop =
      this.scrollableDiv.nativeElement.scrollHeight;
  }

  leaveTopic(topicId: string): void {
    this.chatService.leaveTopic(topicId);
    this.topic!.messages = [];

    this.router.navigateByUrl('chat');
  }

  onSendMessage() {
    if (!this.message) {
      this.toastService.showToast(
        EToastTypes.warning,
        'Enter a valid message!'
      );
      return;
    }

    if (this.profanityFilter.isProfane(this.message)) {
      this.toastService.showToast(EToastTypes.warning, "Profanity words are not allowed!");

      this.message = undefined;
      return;
    }

    this.chatService.sendMessage(this.topic!.id, this.message);
    this.message = undefined;
  }

  onEmojiSelected(emoji: string) {
    if (!this.message) {
      this.message = '';
    }

    if (this.message.length === 0) {
      this.message += emoji;
    } else {
      this.message += ' ' + emoji;
    }
  }

  onLeave() {
    this.chatService.leaveTopic(this.chatService.topicId);
    this.router.navigate(['chat']);
  }

  onShareUrl() {
    const url = `${window.location.origin}${this.router.url}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Share chat room link!',
          url,
        })
        .then(() => {
          console.log('Successful share');
        })
        .catch((error) => {
          console.log('Error sharing:', error);
        });
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert('URL copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    }
  }

  protected readonly EMessageViewType = EMessageViewType;
}
