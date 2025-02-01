import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { ChatService } from "../../services/chat.service";
import { EModalAction } from "../../components/modals/join-room-code-modal/join-room-code-modal.component";
import { EToastTypes, ToastService } from '../../services/toast.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { CreateTopicModalComponent } from "../../components/modals/create-topic-modal/create-topic-modal.component";
import { openLogoutModalSubject as openLogoutModalSubject, openCreateModalSubject, openMessagePreviewModal } from '../../subjects/subjects';
import { filter, Subscription } from 'rxjs';
import { LogoutModalComponent } from "../../components/modals/logout-modal/logout-modal.component";
import { IMessage } from '../../models/IMessage';
import { MessageViewModalComponent } from "../../components/modals/message-view-modal/message-view-modal.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    CreateTopicModalComponent,
    LogoutModalComponent,
    MessageViewModalComponent
],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  protected joinRoomModalAction: EventEmitter<{ code: string; action: EModalAction }> = new EventEmitter<{ code: string; action: EModalAction }>();
  protected viewMessageModalData: IMessage;
  protected modalsState = {
    isLogoutModalOpen: false,
    isCreateRoomModalOpen: false,
    isViewMessageModalOpen: false
  }
  protected joinRoomModalState: boolean;
  protected isSidebarVisible: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(public authService: AuthService,
              public chatService: ChatService,
              private router: Router,
              private toastService: ToastService) {
  }

  public ngOnInit(): void {
    this.authService.fetchAndUpdateUser();

    this.subscriptions.push(openCreateModalSubject.subscribe(() => this.modalsState.isCreateRoomModalOpen = true));
    this.subscriptions.push(openLogoutModalSubject.subscribe(() => this.modalsState.isLogoutModalOpen = true));
    this.subscriptions.push(openMessagePreviewModal.subscribe((message: IMessage) => {
      this.viewMessageModalData = message;
      this.modalsState.isViewMessageModalOpen = true;
    }));

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url.includes('view') && window.innerWidth < 768) {
        this.isSidebarVisible = false;
      } else {
        this.isSidebarVisible = true;
      }
    });

    const joinSub: Subscription = this.joinRoomModalAction.subscribe(actionValue => {
      if (actionValue && actionValue.action === EModalAction.Submit) {
        this.chatService.getTopicByRoomCode(actionValue.code).then(res => {
          this.chatService.joinTopic(res!.id);
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
}
