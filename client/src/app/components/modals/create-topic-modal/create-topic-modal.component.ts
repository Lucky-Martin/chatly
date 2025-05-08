import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Filter } from 'bad-words';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth/auth.service';
import { EToastTypes, ToastService } from '../../../services/toast.service';
import { SearchbarDropdownComponent } from "./searchbar-dropdown/searchbar-dropdown.component";
import { openCreateModalSubject } from '../../../subjects/subjects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-create-topic-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SearchbarDropdownComponent,
    TranslateModule
  ],
  templateUrl: './create-topic-modal.component.html',
  styleUrl: './create-topic-modal.component.scss'
})
export class CreateTopicModalComponent {
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  topicName: string;
  publicChatRoom: boolean = true;
  interests: string[];
  private profanityFilter: Filter = new Filter();

  constructor(private chatService: ChatService,
              private authService: AuthService,
              private toastService: ToastService,
              private translateService: TranslateService,
              private languageService: LanguageService
  ) {
    // Ensure language is properly set
    const currentLang = this.languageService.getCurrentLanguage();
    console.log('Create topic modal: setting language to', currentLang);
    this.translateService.use(currentLang);
  }

  onCloseModal() {
    this.modalClosed.emit();
  }

  onCreateTopic() {
    if (!this.topicName) {
      this.toastService.showToast(EToastTypes.warning, this.translateService.instant('chat.enterRoomNameRequired'));
      return;
    }

    if (this.profanityFilter.isProfane(this.topicName)) {
      this.toastService.showToast(EToastTypes.warning, this.translateService.instant('errors.profanityNotAllowed'));
      return;
    }

    if (this.chatService.currentTopicId) {
      this.chatService.leaveTopic(this.chatService.currentTopicId);
    }

    if (!this.interests || !this.interests.length) {
      this.toastService.showToast(EToastTypes.warning, this.translateService.instant('chat.selectInterestRequired'));
      return;
    }

    this.chatService.createTopic(this.topicName, this.interests, this.publicChatRoom, this.authService.user._id);
    this.modalClosed.emit();
  }

  onChangeState() {
    this.publicChatRoom = !this.publicChatRoom;
  }
}
