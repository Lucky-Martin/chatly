import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { NgClass } from "@angular/common";
import { Share } from "@capacitor/share";
import { Clipboard } from "@angular/cdk/clipboard";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    DeleteMessageModalComponent,
    NgClass,
    TranslateModule
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss',
})
export class ConversationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('messageContainer') messageContainer: ElementRef<HTMLDivElement>;

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

  private profanityFilter: Filter;
  private messageSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    private clipboard: Clipboard,
    protected chatService: ChatService,
    protected authService: AuthService,
    private translateService: TranslateService
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

      this.scrollToBottom();
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

  public ngAfterViewInit(): void {
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

  public onSendMessage(): void {
    if (!this.message.trim()) {
      this.toastService.showToast(EToastTypes.warning, this.translateService.instant('errors.required'));
      return;
    }

    if (this.profanityFilter.isProfane(this.message)) {
      this.toastService.showToast(EToastTypes.warning, this.translateService.instant('errors.profanityNotAllowed'));
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

  public async onShareUrl(): Promise<void> {
    const url = `${window.location.origin}${this.router.url}`;
    const canShareResult = await Share.canShare();

    if (canShareResult.value) {
      await Share.share({
        title: this.translateService.instant('chat.shareRoom'),
        text: this.translateService.instant('chat.joinRoomMessage'),
        url,
        dialogTitle: this.translateService.instant('chat.shareWithFriends'),
      });

      return;
    }

    if (navigator.share) {
      navigator.share({
        title: this.translateService.instant('chat.shareChatLink'),
        url,
      }).then(() => {
        console.log('Successful share');
      }).catch((error: Error) => {
        alert(`Error sharing: ${error.message}`);
        console.error('Error sharing:', error);
      });
    } else {
      this.clipboard.copy(url);
      alert(this.translateService.instant('chat.linkCopied'));
    }
  }

  public onUpdateEditModalState(isVisible: boolean): void {
    this.isEditTopicModalVisible = isVisible;
  }

  private scrollToBottom(): void {
    if (!this.messageContainer?.nativeElement) return;

    setTimeout(() => {
      const container = this.messageContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }, 1);
  }
}
