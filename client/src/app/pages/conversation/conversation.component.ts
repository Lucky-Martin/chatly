import {
  AfterViewChecked,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from 'bad-words';
import { Subscription } from 'rxjs';
import { IMessage } from '../../models/IMessage';
import { ITopic } from '../../models/ITopic';
import { AuthService } from '../../services/auth/auth.service';
import { ChatService } from '../../services/chat.service';
import { ToastService, EToastTypes } from '../../services/toast.service';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { MessageItemComponent, EMessageViewType } from './message-item/message-item.component';
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { EditRoomModalComponent } from "../../components/modals/edit-room-modal/edit-room-modal.component";
import { EditMessageModalComponent } from "../../components/modals/edit-message-modal/edit-message-modal.component";
import { openDeleteMessageModal, openMessageEditModal } from '../../subjects/subjects';
import { DeleteMessageModalComponent } from "../../components/modals/delete-message-modal/delete-message-modal.component";

export interface IMessageModalData {
  isOpen: boolean;
  message?: IMessage;
}

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [
    FormsModule,
    EmojiPickerComponent,
    ParticipantsListComponent,
    SpinnerComponent,
    TruncatePipe,
    MessageItemComponent,
    EditRoomModalComponent,
    EditMessageModalComponent,
    DeleteMessageModalComponent
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss',
})
export class ConversationComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer: ElementRef<HTMLDivElement>;
  private scrollableDiv!: ElementRef<HTMLDivElement>;
  private profanityFilter: Filter;
  private messageSubscription: Subscription | undefined;
  protected readonly EMessageViewType = EMessageViewType;
  protected readonly window: Window = window;
  protected topic: ITopic | undefined;
  protected message: string = '';
  protected isEmojiOpen: boolean = false;
  protected isParticipantVisible: boolean = false;
  protected isEditTopicModalVisible: boolean = false;
  protected editMessageModalData: IMessageModalData = {
    isOpen: false
  };
  protected deleteMessageModalData: IMessageModalData = {
    isOpen: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    protected chatService: ChatService,
    protected authService: AuthService
  ) {
    this.profanityFilter = new Filter();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const topicId = params['topicId'];
      if (topicId) {
        this.handleTopicChange(topicId);
      }
    });

    this.chatService.topics$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((topics: ITopic[]) => {
      const currentTopicIndex: number = topics.findIndex((topic: ITopic) => topic.id === this.chatService.currentTopicId);
      if (currentTopicIndex > -1) {
        this.topic = topics[currentTopicIndex];
      }
    });

    openMessageEditModal.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message: IMessage) => {
      this.editMessageModalData.isOpen = true;
      this.editMessageModalData.message = message;
    });

    openDeleteMessageModal.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message: IMessage) => {
      this.deleteMessageModalData.isOpen = true;
      this.deleteMessageModalData.message = message;
    });
  }

  public ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  protected onEditMessageModalState(state: boolean) {
    this.editMessageModalData.isOpen = state;
  }

  protected onDeleteMessageModalState(state: boolean) {
    this.deleteMessageModalData.isOpen = state;
  }

  private handleTopicChange(topicId: string): void {
    if (this.chatService.currentTopicId) {
      this.chatService.leaveTopic(this.chatService.currentTopicId);
    }

    setTimeout(async () => {
      await this.router.navigate(['chat', 'view'], { queryParams: { topicId } });
    }, 100);

    this.topic = undefined;

    setTimeout(() => {
      this.chatService.getTopicMessages(topicId).subscribe(
        (res: ITopic) => {
          this.topic = res;
        },
        (err: any) => {
          console.error(err);
          this.router.navigate(['chat']);
        }
      );
    }, 1000);

    this.chatService.joinTopic(topicId);

    this.messageSubscription = this.chatService.messages$.subscribe((messages: IMessage[]) => {
      if (this.topic) {
        this.topic.messages = messages;
      }
    });
  }

  public leaveTopic(topicId: string): void {
    this.chatService.leaveTopic(topicId);
    if (this.topic) {
      this.topic.messages = [];
    }
    this.router.navigateByUrl('chat');
  }

  public onSendMessage(): void {
    if (!this.message.trim()) {
      this.toastService.showToast(EToastTypes.warning, 'Enter a valid message!');
      return;
    }

    if (this.profanityFilter.isProfane(this.message)) {
      this.toastService.showToast(EToastTypes.warning, 'Profanity words are not allowed!');
      this.message = '';
      return;
    }

    if (this.topic) {
      this.chatService.sendMessage(this.topic.id, this.message);
      this.message = '';
    }
  }

  public onEmojiSelected(emoji: string): void {
    this.message = this.message.trim() ? `${this.message} ${emoji}` : emoji;
  }

  public onLeave(): void {
    if (this.chatService.currentTopicId) {
      this.chatService.leaveTopic(this.chatService.currentTopicId);
    }
    this.router.navigate(['chat']);
  }

  public onShareUrl(): void {
    const url = `${window.location.origin}${this.router.url}`;

    if (navigator.share) {
      navigator.share({
        title: 'Share chat room link!',
        url,
      }).then(() => {
        console.log('Successful share');
      }).catch((error: Error) => {
        alert(`Error sharing: ${error.message}`);
        console.error('Error sharing:', error);
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard!');
      }).catch((err: Error) => {
        console.error('Failed to copy: ', err);
      });
    }
  }

  public onUpdateEditModalState(isVisible: boolean): void {
    this.isEditTopicModalVisible = isVisible;
  }

  private scrollToBottom(): void {
    if (!this.scrollableDiv) return;
    this.scrollableDiv.nativeElement.scrollTop = this.scrollableDiv.nativeElement.scrollHeight;
  }
}
