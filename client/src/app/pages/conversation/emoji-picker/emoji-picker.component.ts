import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PickerComponent } from "@ctrl/ngx-emoji-mart";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [
    PickerComponent,
    NgIf
  ],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent {
  @Input() isEmojiOpen: boolean;
  @Output() emojiSelected: EventEmitter<string> = new EventEmitter<string>();

  onEmojiSelected(emoji: {emoji: {native: string}}) {
    this.emojiSelected.emit(emoji.emoji.native);

    if (window.innerWidth < 992) {
      this.isEmojiOpen = false;
    }
  }
}
