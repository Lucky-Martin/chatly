import { Component, EventEmitter, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

export enum EModalAction {
  Close,
  Submit
}

@Component({
  selector: 'app-join-room-code-modal',
  standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule
	],
  templateUrl: './join-room-code-modal.component.html',
  styleUrl: './join-room-code-modal.component.scss'
})
export class JoinRoomCodeModalComponent {
  @Input() joinRoomClicked: EventEmitter<{code: string, action: EModalAction}> = new EventEmitter();
  code: string;

  onJoinRoom() {
    this.joinRoomClicked.emit({code: this.code, action: EModalAction.Submit});
    this.code = '';
  }

  onCloseModal() {
    this.joinRoomClicked.emit({code: '', action: EModalAction.Close});
  }
}
