import { Component, Input, OnInit } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { IParticipants } from '../../../models/IParticipants';
import { ITopic } from '../../../models/ITopic';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-participants-list',
  standalone: true,
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './participants-list.component.html',
  styleUrl: './participants-list.component.scss'
})
export class ParticipantsListComponent implements OnInit {
  @Input() topic: ITopic;
  @Input() isVisible: boolean;
  participants: IParticipants;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.detectMobile();
    window.onresize = (this.detectMobile.bind(this));

    this.chatService.participants$.subscribe(participants => {
      this.participants = participants;
    });
  }

  private detectMobile() {
    this.isVisible = window.innerWidth <= 772;
  }
}
