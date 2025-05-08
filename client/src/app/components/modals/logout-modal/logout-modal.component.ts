import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
    imports: [
        FormsModule,
        TranslateModule
    ],
  templateUrl: './logout-modal.component.html',
  styleUrl: './logout-modal.component.scss'
})
export class LogoutModalComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() logoutUser: EventEmitter<void> = new EventEmitter<void>();
}
