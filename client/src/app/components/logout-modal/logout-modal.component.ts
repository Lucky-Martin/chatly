import { Component, EventEmitter, Input } from '@angular/core';
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
  @Input() actionDispatched: EventEmitter<boolean> = new EventEmitter<boolean>();
}
