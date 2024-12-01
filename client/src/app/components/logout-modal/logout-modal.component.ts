import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-logout-modal',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './logout-modal.component.html',
  styleUrl: './logout-modal.component.scss'
})
export class LogoutModalComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() logoutUser: EventEmitter<void> = new EventEmitter<void>();
}
