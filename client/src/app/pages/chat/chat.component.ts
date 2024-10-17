import { Component, EventEmitter, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ViewTopicsComponent} from "./view-topics/view-topics.component";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import {NgIf} from "@angular/common";
import { IUser } from "../../models/IUser";
import { TruncatePipe } from '../../pipes/truncate.pipe';
import {ChatService} from "../../services/chat.service";
import { LogoutModalComponent } from "../../components/logout-modal/logout-modal.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ViewTopicsComponent,
    RouterOutlet,
    NgIf,
    TruncatePipe,
    LogoutModalComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  topicModalOpened: EventEmitter<void> = new EventEmitter();
  logoutModalAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  logoutModalState: boolean = false;

  constructor(public authService: AuthService,
              public chatService: ChatService) {
  }

  ngOnInit() {
    this.authService.updateUser();

    this.logoutModalAction.subscribe(actionValue => {
      if (actionValue) {
        this.onLogout();
      } else {
        this.logoutModalState = false;
      }
    })
  }

  onOpenTopicModal() {
    this.topicModalOpened.next();
  }

  async onLogout() {
    await this.authService.logout();
  }
}
