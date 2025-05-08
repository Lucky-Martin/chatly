import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchbarDropdownComponent } from '../create-topic-modal/searchbar-dropdown/searchbar-dropdown.component';
import { ChatService } from '../../../services/chat.service';
import { EToastTypes, ToastService } from '../../../services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-room-modal',
  standalone: true,
  imports: [
    SearchbarDropdownComponent,
    TranslateModule
  ],
  templateUrl: './edit-room-modal.component.html',
  styleUrl: './edit-room-modal.component.scss',
})
export class EditRoomModalComponent {
  @Input() interests: string[] = [];
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private chatService: ChatService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  protected onCloseModal(): void {
    this.closeModal.emit();
  }

  protected onUpdateInterests(interests: string[]): void {
    this.interests = interests;
  }

  protected onSaveChanges(event: Event): void {
    event.preventDefault();

    if (!this.interests.length) {
      this.toastService.showToast(EToastTypes.warning, this.translateService.instant('chat.selectInterestRequired'));
      return;
    }

    this.chatService
      .editTopicInterests(this.chatService.currentTopicId, this.interests)
      .subscribe(
        (result) => {
          this.closeModal.emit();
        },
        (err) => {
          this.toastService.showToast(EToastTypes.warning, this.translateService.instant('errors.interestsSaveError'));
          console.warn(err);
        }
      );
  }
}
