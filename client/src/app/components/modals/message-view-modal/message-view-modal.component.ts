import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMessage } from '../../../models/IMessage';
import { TruncatePipe } from "../../../pipes/truncate.pipe";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-message-view-modal',
  standalone: true,
  imports: [
    TruncatePipe,
    TranslateModule
  ],
  templateUrl: './message-view-modal.component.html',
  styleUrl: './message-view-modal.component.scss'
})
export class MessageViewModalComponent {
  @Input() message: IMessage;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
}
