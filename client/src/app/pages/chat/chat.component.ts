import { Component, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { ViewTopicsComponent } from "./view-topics/view-topics.component";
import { RouterOutlet } from "@angular/router";
import { NgIf } from "@angular/common";
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ChatService } from "../../services/chat.service";
import { LogoutModalComponent } from "../../components/logout-modal/logout-modal.component";
import { EModalAction, JoinRoomCodeModalComponent } from "../../components/join-room-code-modal/join-room-code-modal.component";
import { EToastTypes, ToastService } from '../../services/toast.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ViewTopicsComponent,
    RouterOutlet,
    NgIf,
    TruncatePipe,
    LogoutModalComponent,
    JoinRoomCodeModalComponent,
    SidebarComponent
],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  topicModalOpened: EventEmitter<void> = new EventEmitter();
  logoutModalAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  joinRoomModalAction: EventEmitter<{ code: string; action: EModalAction }> = new EventEmitter<{ code: string; action: EModalAction }>();
  logoutModalState: boolean = false;
  joinRoomModalState: boolean = false;

  constructor(public authService: AuthService,
              public chatService: ChatService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.authService.updateUser();

    this.logoutModalAction.subscribe(actionValue => {
      if (actionValue) {
        this.onLogout();
      } else {
        this.logoutModalState = false;
      }
    });

    this.joinRoomModalAction.subscribe(actionValue => {
      if (actionValue && actionValue.action === EModalAction.Submit) {
        this.chatService.getTopicByRoomCode(actionValue.code).then(res => {
          this.chatService.joinTopic(res.topic.id);
        }).catch(error => {
          this.toastService.showToast(EToastTypes.warning, "Invalid room code!");
          console.warn(error);
        })
      }
      this.joinRoomModalState = false;
    });
  }

  onOpenTopicModal() {
    this.topicModalOpened.next();
  }

  async onLogout() {
    await this.authService.logout();
  }
}
