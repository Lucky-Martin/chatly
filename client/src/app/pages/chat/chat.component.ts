import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { RouterOutlet } from "@angular/router";
import { ChatService } from "../../services/chat.service";
import { EModalAction } from "../../components/join-room-code-modal/join-room-code-modal.component";
import { EToastTypes, ToastService } from '../../services/toast.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { CreateTopicModalComponent } from "../../components/create-topic-modal/create-topic-modal.component";
import { openCreateModalSubject } from '../../services/subjects';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    CreateTopicModalComponent
],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  protected topicModalOpened: EventEmitter<void> = new EventEmitter();
  protected logoutModalAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  protected joinRoomModalAction: EventEmitter<{ code: string; action: EModalAction }> = new EventEmitter<{ code: string; action: EModalAction }>();
  protected logoutModalState: boolean;
  protected joinRoomModalState: boolean;
  protected isCreateRoomModalOpen: boolean;
  private subscriptions: Subscription[] = [];

  constructor(public authService: AuthService,
              public chatService: ChatService,
              private toastService: ToastService) {
  }

  public ngOnInit(): void {
    this.authService.updateUser();
    this.subscriptions.push(openCreateModalSubject.subscribe(() => this.isCreateRoomModalOpen = true));

    const logoutSub: Subscription = this.logoutModalAction.subscribe(actionValue => {
      if (actionValue) {
        this.onLogout();
      } else {
        this.logoutModalState = false;
      }
    });
    this.subscriptions.push(logoutSub);

    const joinSub: Subscription = this.joinRoomModalAction.subscribe(actionValue => {
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
    this.subscriptions.push(joinSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onOpenTopicModal(): void {
    this.topicModalOpened.next();
  }

  public async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}
